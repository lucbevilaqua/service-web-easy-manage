import { 
  ChangeDetectionStrategy, 
  Component, 
  signal, 
  input, 
  output, 
  computed, 
  inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardBadgeVariants } from '@shared/components/badge/badge.variants';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { 
  ZardTableComponent, 
  ZardTableHeaderComponent, 
  ZardTableBodyComponent, 
  ZardTableRowComponent, 
  ZardTableHeadComponent, 
  ZardTableCellComponent 
} from '@shared/components/table/table.component';
import { ZardInputGroupComponent } from '@shared/components/input-group/input-group.component';
import { ZardPaginationComponent } from '@shared/components/pagination/pagination.component';
import { FilterModalComponent } from '@shared/components/filter-modal/filter-modal.component';
import { CreateModalComponent } from '@shared/components/create-modal/create-modal.component';
import { EditModalComponent } from '@shared/components/edit-modal/edit-modal.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { FilterConfig } from '@shared/components/filter-modal/filter-modal.interfaces';
import { CreateConfig } from '@shared/components/create-modal/create-modal.interfaces';
import { 
  BadgeColumn, 
  Column, 
  BaseListPageConfig,
  ActionColumn,
  DateColumn,
  NumberColumn,
  BooleanColumn,
} from './base-list.interfaces';
import { FirestoreService } from '@core/services/firestore.service';
import type { DocumentSnapshot } from 'firebase/firestore';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';

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
    ZardInputGroupComponent,
    ZardPaginationComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './base-list-page.html',
  styleUrl: './base-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseListPage implements OnInit, OnDestroy {
  protected dialogService = inject(ZardDialogService);

  // Input signals
  readonly config = input.required<BaseListPageConfig>();
  readonly filterConfig = computed<FilterConfig[]>(() => this.config().filters || []);
  readonly createConfig = computed<CreateConfig[]>(() => this.config().createConfig || []);
  // Output signals
  readonly onAction = output<{ actionId: string; item: any }>();
  readonly onRowClick = output<any>();

  // Services
  private readonly firestoreService = inject(FirestoreService);

  // State signals
  readonly dataSource = signal<Array<any>>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal<string>('');
  readonly currentPage = signal<number>(1);
  readonly lastDoc = signal<DocumentSnapshot | null>(null);
  readonly hasMore = signal<boolean>(false);
  readonly appliedFilters = signal<Record<string, any>>({});
  readonly isConfirmDialogOpen = signal<boolean>(false);
  readonly itemToDelete = signal<{ id: string; [key: string]: any } | null>(null);

  // Computed signals
  readonly columns = computed<Array<Column>>(() => {
    const cols = this.config().columns;
    // Ensure actions column exists with edit and delete as defaults
    const actionsCol = cols.find(col => col.type === 'actions') as ActionColumn | undefined;
    
    if (actionsCol) {
      // Check if edit and delete are already present
      const hasEdit = actionsCol.actions?.some(a => a.id === 'edit');
      const hasDelete = actionsCol.actions?.some(a => a.id === 'delete');
      
      const defaultActions = [
        ...(!hasEdit ? [{ id: 'edit', tooltip: 'Edit', icon: 'save' as const }] : []),
        ...(!hasDelete ? [{ id: 'delete', tooltip: 'Delete', icon: 'x' as const }] : []),
        ...(actionsCol.actions || [])
      ];
      
      // Update the actions column
      return cols.map(col => 
        col.type === 'actions' 
          ? { ...col, actions: defaultActions }
          : col
      );
    }
    
    // If no actions column exists, add one with edit and delete
    return [
      ...cols,
      {
        type: 'actions' as const,
        label: 'Actions',
        field: '',
        key: '',
        class: 'w-16',
        actions: [
          { id: 'edit', tooltip: 'Edit', icon: 'eye' as const },
          { id: 'delete', tooltip: 'Delete', icon: 'trash' as const }
        ]
      }
    ];
  });
  readonly title = computed(() => this.config().title);
  readonly subtitle = computed(() => this.config().subtitle ?? '');
  readonly pageSize = computed(() => this.config().pageSize ?? 10);
  readonly pathDb = computed(() => {
    const path = this.config().pathDb;
    return path.startsWith('/') ? path.slice(1) : path;
  });
  
  readonly totalPages = computed(() => {
    const current = this.currentPage();
    const more = this.hasMore();
    return more ? current + 1 : current;
  });

  readonly searchFields = computed(() => {
    return this.columns().map(col => col.key);
  });

  readonly hasFilterConfig = computed(() => {
    return this.filterConfig().length > 0;
  });

  readonly hasCreateConfig = computed(() => {
    return this.createConfig().length > 0;
  });

  private searchTimeout: any | null = null;

  constructor() {
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    // But we can explicitly destroy it if needed
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const config = this.config();
      const page = this.currentPage();
      const search = this.searchTerm();
      const filters = this.appliedFilters();
      const pageSize = this.pageSize();
      const lastDoc = this.lastDoc();
      const isFirstPage = page === 1;
      const path = this.pathDb();

      console.log('Loading data from Firestore:', {
        path,
        page,
        pageSize,
        search,
        filtersCount: Object.keys(filters).length
      });

      await this.loadFromFirestore({
        path,
        pageSize,
        orderByField: config.orderByField,
        orderByDirection: config.orderByDirection ?? 'asc',
        lastDoc: isFirstPage ? undefined : lastDoc || undefined,
        searchTerm: search || undefined,
        searchFields: this.searchFields(),
        filters: this.buildFirestoreFilters(filters)
      });
    } catch (err: any) {
      console.error('Error loading data:', err);
      this.error.set(err.message || 'Error loading data');
      this.dataSource.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadFromFirestore(options: {
    path: string;
    pageSize: number;
    orderByField?: string;
    orderByDirection?: 'asc' | 'desc';
    lastDoc?: DocumentSnapshot;
    searchTerm?: string;
    searchFields: string[];
    filters: Record<string, { operator: any; value: any }>;
  }): Promise<void> {
    const result = await this.firestoreService.getPaginatedData(options);
    this.dataSource.set(result.data);
    this.lastDoc.set(result.lastDoc);
    this.hasMore.set(result.hasMore);
  }

  private buildFirestoreFilters(filters: Record<string, any>): Record<string, { operator: any; value: any }> {
    const firestoreFilters: Record<string, { operator: any; value: any }> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        // Default to equality operator, can be extended
        firestoreFilters[key] = {
          operator: '==',
          value
        };
      }
    });

    return firestoreFilters;
  }

  onSearchChange(event: Event | string): void {
    let value: string;
    if (typeof event === 'string') {
      value = event;
    } else {
      value = (event.target as HTMLInputElement)?.value || '';
    }
    this.searchTerm.set(value);
    this.loadData();
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.currentPage.set(1);
      this.lastDoc.set(null);
      this.searchTimeout = null;
    }, 350);
  }

  onPageChange(page: number): void {
    this.currentPage.set(Math.max(1, page));
    this.loadData();
  }

  handleAction(actionId: string, item: any): void {
    // Edit action: open edit modal
    if (actionId === 'edit') {
      this.dialogService.create({
        zTitle: 'Edit Item',
        zContent: EditModalComponent,
        zData: {
          config: this.createConfig(), // Reuse create config for edit
          pathDb: this.pathDb(),
          item: item
        },
        zOkText: 'Save',
        zOnOk: instance => instance.update().then(() => this.loadData()),
      });
      return;
    }

    // Delete action: show confirmation dialog
    if (actionId === 'delete') {
      this.itemToDelete.set(item);
      this.isConfirmDialogOpen.set(true);
      return;
    }

    // Other actions: send to parent via output
    this.onAction.emit({ actionId, item });
  }

  async confirmDelete(): Promise<void> {
    const item = this.itemToDelete();
    if (!item || !item.id) {
      this.isConfirmDialogOpen.set(false);
      return;
    }

    try {
      await this.firestoreService.deleteDocument(this.pathDb(), item.id);
      // Reload data after delete
      this.currentPage.set(1);
      this.lastDoc.set(null);
      this.isConfirmDialogOpen.set(false);
      this.itemToDelete.set(null);
      this.loadData();
    } catch (error) {
      console.error('Error deleting item:', error);
      // Error is already handled by the service
    }
  }

  cancelDelete(): void {
    this.itemToDelete.set(null);
  }

  onFiltersChange(filters: Record<string, any>): void {
    this.appliedFilters.set(filters);
    this.currentPage.set(1);
    this.lastDoc.set(null);
    this.loadData();
  }

  toggleFilterModal(): void {
    const dialogRef = this.dialogService.create({
      zTitle: 'Filters',
      zContent: FilterModalComponent,
      zData: {
        config: this.filterConfig(),
        initialValues: this.appliedFilters()
      },
      zOkText: 'Apply Filters',
      zCancelText: 'Cancel',
      zOnOk: instance => {
        const filters = instance.getFilters();
        this.onFiltersChange(filters);
      },
      zOnCancel: instance => {
        instance.clearAllFilters();
      }
    });
  }

  toggleCreateModal(): void {
    this.dialogService.create({
      zTitle: 'Create New Item',
      zContent: CreateModalComponent,
      zData: {
        config: this.createConfig(),
        pathDb: this.pathDb()
      },
      zOkText: 'Create',
      zOnOk: instance => instance.create(),
    });
  }

  onItemCreated(): void {
    this.currentPage.set(1);
    this.lastDoc.set(null);
    this.loadData();
  }

  getActions(col: Column): ActionColumn['actions'] | null {
    if (col.type === 'actions') {
      return (col as ActionColumn).actions ?? null;
    }
    return null;
  }

  protected getBadgeColor(col: Column, row: any): ZardBadgeVariants['zType'] {
    if (col.type !== 'badge') {
      return 'default';
    }
    const column = col as BadgeColumn;
    if (typeof column.color === 'function') {
      return column.color(row);
    }
    return column.color || 'default';
  }

  formatCellValue(col: Column, value: any, row: any): string {
    if (col.format && typeof col.format === 'function') {
      return col.format(value, row);
    }

    switch (col.type) {
      case 'date':
        const dateCol = col as DateColumn;
        if (value) {
          const date = value.toDate ? value.toDate() : new Date(value);
          const format = dateCol.format || 'short';
          return new Intl.DateTimeFormat('en-US', {
            dateStyle: format === 'short' ? 'short' : format === 'long' ? 'long' : 'medium'
          }).format(date);
        }
        return '';
      
      case 'number':
        const numCol = col as NumberColumn;
        if (value === null || value === undefined) {
          return '';
        }
        const num = Number(value);
        if (isNaN(num)) {
          return String(value);
        }
        if (numCol.format === 'currency') {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(num);
        }
        if (numCol.format === 'percent') {
          return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: numCol.decimals ?? 2
          }).format(num / 100);
        }
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: numCol.decimals ?? 0,
          maximumFractionDigits: numCol.decimals ?? 2
        }).format(num);
      
      case 'boolean':
        const boolCol = col as BooleanColumn;
        return value ? (boolCol.trueLabel ?? 'Yes') : (boolCol.falseLabel ?? 'No');
      
      default:
        return value !== null && value !== undefined ? String(value) : '';
    }
  }

  trackByItem(index: number, item: any): any {
    return item.id ?? item.key ?? index;
  }
}
