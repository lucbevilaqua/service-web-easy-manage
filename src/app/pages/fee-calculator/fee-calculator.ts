import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { FirestoreService } from '@core/services/firestore.service';
import { ZardInputGroupComponent, ZardSelectComponent, ZardButtonComponent, ZardIconComponent } from '@ui/components';
import { ZardSelectItemComponent } from 'src/app/ui/components/select/select-item.component';
import { ZardFormModule } from 'src/app/ui/components/form/form.module';
import { ZardInputDirective } from '@ui/components/input/input.directive';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-fee-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZardInputGroupComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardButtonComponent,
    ZardIconComponent,
    ZardFormModule,
    ZardInputDirective
  ],
  template: `
    <div class="flex flex-col h-full gap-6 p-6 max-w-2xl mx-auto">
      <div class="space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight">Calculadora de Taxas</h1>
        <p class="text-sm text-muted-foreground">Calcule o valor final a ser cobrado para receber o valor líquido desejado.</p>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <form [formGroup]="form" class="space-y-4 md:col-span-2">
          <z-form-field>
            <z-form-label>Valor Líquido Desejado (R$)</z-form-label>
            <z-form-control>
              <z-input-group class="w-full">
                <input zInput type="number" formControlName="netAmount" placeholder="0.00" step="0.01" />
              </z-input-group>
            </z-form-control>
          </z-form-field>

          <div class="grid gap-4 md:grid-cols-2">
            <z-form-field>
              <z-form-label>Forma de Pagamento</z-form-label>
              <z-form-control>
                <z-select formControlName="paymentMethodId" placeholder="Selecione...">
                  @for (method of paymentMethods(); track method.id) {
                    <z-select-item [zValue]="method.id">{{ method.name }}</z-select-item>
                  }
                </z-select>
              </z-form-control>
            </z-form-field>

            <z-form-field>
              <z-form-label>Parcelamento</z-form-label>
              <z-form-control>
                <z-select formControlName="installmentIndex" placeholder="Selecione..." [disabled]="!selectedMethod()">
                  @if (selectedMethod()?.fees?.length) {
                    @for (fee of selectedMethod()!.fees; track $index) {
                      <z-select-item [zValue]="$index.toString()">
                        {{ fee.installments }}x ({{ fee.fee }}%)
                      </z-select-item>
                    }
                  } @else {
                     <z-select-item zValue="" [zDisabled]="true">Sem taxas cadastradas</z-select-item>
                  }
                </z-select>
              </z-form-control>
            </z-form-field>
          </div>
        </form>
      </div>

      @if (result(); as res) {
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm mt-4">
          <div class="p-6 flex flex-col items-center text-center space-y-2">
            <h3 class="text-sm font-medium text-muted-foreground uppercase tracking-wider">Valor a ser cobrado do cliente</h3>
            <div class="text-4xl font-bold text-primary">
              {{ res.total | currency:'BRL' }}
            </div>
            <div class="text-sm text-muted-foreground mt-2">
              Para receber líquido: <span class="font-medium text-foreground">{{ res.net | currency:'BRL' }}</span>
            </div>
            <div class="text-xs text-muted-foreground">
              Taxa aplicada: {{ res.fee }}% ({{ res.feeAmount | currency:'BRL' }})
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeeCalculatorPage {
  private fb = inject(FormBuilder);
  private firestore = inject(FirestoreService);

  form = this.fb.group({
    netAmount: [null as number | null, [Validators.required, Validators.min(0)]],
    paymentMethodId: ['' as string, Validators.required],
    installmentIndex: ['' as string, Validators.required]
  });

  paymentMethods = signal<any[]>([]);
  
  // Signals derived from form values
  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  selectedMethod = computed(() => {
    const methods = this.paymentMethods();
    const id = this.formValues().paymentMethodId;
    return methods.find(m => m.id === id);
  });

  result = computed(() => {
    const values = this.formValues();
    const net = Number(values.netAmount);
    const method = this.selectedMethod();
    const index = Number(values.installmentIndex);

    if (!net || !method || isNaN(index) || !method.fees?.[index]) {
      return null;
    }

    const feeConfig = method.fees[index];
    const feePercent = Number(feeConfig.fee);
    
    // Formula: Total = Net / (1 - (Fee / 100))
    const total = net / (1 - (feePercent / 100));
    const feeAmount = total - net;

    return {
      total,
      net,
      fee: feePercent,
      feeAmount
    };
  });

  constructor() {
    this.loadPaymentMethods();
    
    // Reset installment when payment method changes
    this.form.get('paymentMethodId')?.valueChanges.subscribe(() => {
      this.form.get('installmentIndex')?.setValue('');
    });
  }

  async loadPaymentMethods() {
    try {
      const methods = await this.firestore.getCollectionData('payment-methods');
      this.paymentMethods.set(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  }
}
