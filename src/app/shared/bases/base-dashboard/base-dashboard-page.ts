import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from '@core/services/firestore.service';
import { DashboardConfig, DashboardCardConfig, DashboardCardData } from './dashboard.interfaces';
import { DashboardCardComponent } from '@shared/components/dashboard-card/dashboard-card.component';
import { DashboardChartComponent } from '@shared/components/dashboard-chart/dashboard-chart.component';

@Component({
  selector: 'app-base-dashboard-page',
  standalone: true,
  imports: [CommonModule, DashboardCardComponent, DashboardChartComponent],
  template: `
    <div class="w-full h-full flex flex-col p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">{{ config().title }}</h1>
        @if (config().subtitle) {
          <p class="text-muted-foreground">{{ config().subtitle }}</p>
        }
      </div>

      <!-- Grid -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        @for (card of config().cards; track $index) {
          <div [class]="getColSpanClass(card)">
            @if (cardData().get(card)) {
              @if (card.type === 'chart') {
                <app-dashboard-chart
                  [data]="cardData().get(card)!"
                />
              } @else {
                <app-dashboard-card
                  [data]="cardData().get(card)!"
                  [clickable]="!!card.route"
                  (cardClick)="onCardClick(card)"
                />
              }
            } @else {
              <!-- Loading Skeleton -->
              <div class="bg-card rounded-lg border shadow-sm p-6 flex flex-col justify-between h-full space-y-4">
                <div class="flex items-center justify-between">
                  <div class="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  <div class="h-4 w-4 bg-muted animate-pulse rounded"></div>
                </div>
                <div class="space-y-2">
                  <div class="h-8 w-16 bg-muted animate-pulse rounded"></div>
                  <div class="h-3 w-32 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseDashboardPage implements OnInit {
  private router = inject(Router);
  private firestore = inject(FirestoreService);

  readonly config = input.required<DashboardConfig>();
  
  // Map to store data for each card config, using signal for reactivity
  protected readonly cardData = signal<Map<DashboardCardConfig, DashboardCardData>>(new Map());

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    const cards = this.config().cards;
    
    // Cache for promises to avoid duplicate requests for the same dbPath
    const pathRequests = new Map<string, Promise<any[]>>();

    // Initiate requests for all unique paths
    for (const card of cards) {
      if (!pathRequests.has(card.dbPath)) {
        pathRequests.set(card.dbPath, this.firestore.getCollectionData(card.dbPath));
      }
    }
    
    // Process each card as its data becomes available
    cards.forEach(async card => {
      try {
        const request = pathRequests.get(card.dbPath);
        if (request) {
          const data = await request;
          const processedData = card.mapFn(data);
          
          // Update signal with new map instance to trigger change detection
          this.cardData.update(currentMap => {
            const newMap = new Map(currentMap);
            newMap.set(card, processedData);
            return newMap;
          });
        }
      } catch (error) {
        console.error(`Error loading data for card ${card.label}:`, error);
        // Set error state
        this.cardData.update(currentMap => {
          const newMap = new Map(currentMap);
          newMap.set(card, {
            label: card.label,
            value: 'Error',
            color: 'destructive',
            icon: 'triangle-alert'
          });
          return newMap;
        });
      }
    });
  }

  protected getColSpanClass(card: DashboardCardConfig): string {
    const span = card.colSpan || 1;
    switch (span) {
      case 2: return 'col-span-2';
      case 3: return 'col-span-3';
      case 4: return 'col-span-4';
      default: return 'col-span-1';
    }
  }

  protected onCardClick(card: DashboardCardConfig): void {
    if (card.route) {
      this.router.navigate([card.route], { queryParams: card.queryParams });
    }
  }
}
