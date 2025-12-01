import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '@core/services/firestore.service';
import { ZardTableComponent, ZardTableHeaderComponent, ZardTableBodyComponent, ZardTableRowComponent, ZardTableHeadComponent, ZardTableCellComponent } from '@ui/components/table/table.component';
import { ZardButtonComponent, ZardIconComponent, ZardBadgeComponent } from '@ui/components';
import { ZardDialogService } from '@ui/components/dialog/dialog.service';
import { CreatePaymentMethodModal } from './create-modal/create-payment-method-modal';
import { ZardBadgeVariants } from '@ui/components/badge/badge.variants';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [
    CommonModule,
    ZardTableComponent,
    ZardTableHeaderComponent,
    ZardTableBodyComponent,
    ZardTableRowComponent,
    ZardTableHeadComponent,
    ZardTableCellComponent,
    ZardButtonComponent,
    ZardIconComponent,
    ZardBadgeComponent
  ],
  templateUrl: './payment-methods.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentMethodsPage implements OnInit {
  private firestore = inject(FirestoreService);
  private dialog = inject(ZardDialogService);

  data = signal<any[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.loading.set(true);
    try {
      const result = await this.firestore.getCollectionData('payment-methods');
      this.data.set(result);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      this.loading.set(false);
    }
  }

  openCreateModal() {
    this.dialog.create({
      zTitle: 'Nova Forma de Pagamento',
      zContent: CreatePaymentMethodModal,
      zOkText: 'Criar',
      zCancelText: 'Cancelar',
      zWidth: '800px',
      zOkDisabled: (instance: CreatePaymentMethodModal) => instance.form.invalid || instance.loading(),
      zOnOk: async (instance) => {
        await instance.create();
        this.loadData();
      }
    });
  }

  async deleteItem(item: any) {
    if (confirm(`Tem certeza que deseja excluir "${item.name}"?`)) {
      try {
        await this.firestore.deleteDocument('payment-methods', item.id);
        this.loadData();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  }

  getBadgeType(type: string): ZardBadgeVariants['zType'] {
    switch (type) {
      case 'Credito': return 'default';
      case 'Debito': return 'secondary';
      case 'Pix': return 'success';
      case 'Boleto': return 'warning';
      default: return 'outline';
    }
  }
}
