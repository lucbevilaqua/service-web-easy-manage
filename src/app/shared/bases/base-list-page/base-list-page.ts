import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardBadgeVariants } from '@shared/components/badge/badge.variants';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { ZardTableComponent, ZardTableHeaderComponent, ZardTableBodyComponent, ZardTableRowComponent, ZardTableHeadComponent, ZardTableCellComponent } from '@shared/components/table/table.component';
import { BadgeColumn, Column } from './base-list.interfaces';

@Component({
  selector: 'app-base-list-page',
  imports: [
    ZardTableComponent,
    ZardTableHeaderComponent,
    ZardTableBodyComponent,
    ZardTableRowComponent,
    ZardTableHeadComponent,
    ZardTableCellComponent,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardIconComponent,
  ],
  templateUrl: './base-list-page.html',
  styleUrl: './base-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseListPage {
  readonly columns = signal<Column[]>([
    { type: 'badge', label: 'Status', field: 'status', color: (row) => row.status === 'Paid' ? 'default' : 'destructive' },
    { label: 'Email', field: 'email' },
    { label: 'Amount', field: 'amount', class: 'text-right' },
    { 
      type: 'actions',
      label: 'Actions',
      field: '',
      class: 'w-16',
      actions: [
        { id: 'edit', tooltip: 'Edit', icon: 'bell' },
        { id: 'delete', tooltip: 'Delete', icon: 'triangle-alert' }
      ]
    },
  ]);
  readonly dataSource = signal<Array<any>>([
    { id: 1, status: 'Paid', email: 'example@example.com', amount: 100.0 },
    { id: 2, status: 'Pending', email: 'user@example.com', amount: 50.0 },
  ]);

  handleAction(actionId: string, item: any): void {
    console.log(`Action ${actionId} clicked for item`, item);
  }

  getActions(col: Column): Array<any> | null {
    if ((col as any).type === 'actions') {
      return (col as any).actions ?? null;
    }
    return null;
  }

  protected getBadgeColor(col: Column, row: any): ZardBadgeVariants['zType'] {
    const column = col as BadgeColumn;
    if (typeof column.color === 'function') {
      return column.color(row);
    }
    return column.color;
  }
}
