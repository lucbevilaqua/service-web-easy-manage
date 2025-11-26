import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZardIconComponent } from '@ui/components';
import { DashboardCardData } from 'src/app/shared/bases/base-dashboard/dashboard.interfaces';
import { mergeClasses } from '@ui/utils/merge-classes';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule, ZardIconComponent],
  template: `
    <div 
      class="bg-card text-card-foreground rounded-lg border shadow-sm p-6 flex flex-col justify-between h-full transition-all hover:shadow-md cursor-pointer"
      [class.cursor-pointer]="clickable()"
      (click)="cardClick.emit()"
    >
      <div class="flex items-center justify-between space-y-0 pb-2">
        <h3 class="tracking-tight text-sm font-medium text-muted-foreground">{{ data().label }}</h3>
        @if (data().icon) {
          <z-icon [zType]="data().icon!" [class]="iconClasses" />
        }
      </div>
      <div class="flex flex-col gap-1">
        <div class="text-2xl font-bold">{{ data().value }}</div>
        @if (data().subLabel) {
          <p class="text-xs text-muted-foreground">{{ data().subLabel }}</p>
        }
        @if (data().trend) {
          <div class="flex items-center text-xs mt-1" [class]="trendClasses">
            @if (data().trend!.direction === 'up') {
              <z-icon zType="trending-up" class="w-3 h-3 mr-1" />
            } @else if (data().trend!.direction === 'down') {
              <z-icon zType="trending-down" class="w-3 h-3 mr-1" />
            }
            <span>{{ data().trend!.value }}%</span>
            @if (data().trend!.label) {
              <span class="text-muted-foreground ml-1">{{ data().trend!.label }}</span>
            }
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardCardComponent {
  readonly data = input.required<DashboardCardData>();
  readonly clickable = input<boolean>(false);
  readonly cardClick = output<void>();

  protected get iconClasses(): string {
    const color = this.data().color || 'default';
    switch (color) {
      case 'primary': return 'text-primary';
      case 'secondary': return 'text-secondary';
      case 'destructive': return 'text-destructive';
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      case 'neutral': return 'text-gray-500';
      default: return 'text-muted-foreground';
    }
  }

  protected get trendClasses(): string {
    const direction = this.data().trend?.direction;
    if (direction === 'up') return 'text-green-500';
    if (direction === 'down') return 'text-red-500';
    return 'text-muted-foreground';
  }
}
