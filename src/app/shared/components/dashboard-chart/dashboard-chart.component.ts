import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DashboardCardData } from 'src/app/shared/bases/base-dashboard/dashboard.interfaces';

@Component({
  selector: 'app-dashboard-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="bg-card text-card-foreground rounded-lg border shadow-sm p-6 h-full flex flex-col">
      <div class="flex items-center justify-between space-y-0 pb-4">
        <h3 class="tracking-tight text-sm font-medium text-muted-foreground">{{ data().label }}</h3>
      </div>
      <div class="flex-1 min-h-[200px] w-full relative">
        @if (chartData) {
          <canvas baseChart
            [data]="chartData!"
            [options]="chartOptions"
            [type]="chartType">
          </canvas>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardChartComponent {
  readonly data = input.required<DashboardCardData>();

  protected get chartType() {
    return this.data().chartType || 'bar';
  }

  protected get chartData(): ChartConfiguration['data'] | undefined {
    return this.data().chartData;
  }

  protected readonly chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          color: 'oklch(0.556 0 0)' // muted-foreground approximation
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'oklch(0.556 0 0)'
        }
      },
      y: {
        grid: {
          color: 'oklch(0.922 0 0 / 0.1)' // border/input color approximation
        },
        ticks: {
          color: 'oklch(0.556 0 0)'
        }
      }
    }
  };
}
