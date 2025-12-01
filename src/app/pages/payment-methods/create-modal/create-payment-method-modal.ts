import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '@core/services/firestore.service';
import { ZardInputGroupComponent, ZardSelectComponent, ZardButtonComponent, ZardIconComponent } from '@ui/components';
import { ZardSelectItemComponent } from 'src/app/ui/components/select/select-item.component';
import { ZardFormModule } from 'src/app/ui/components/form/form.module';
import { ZardInputDirective } from '@ui/components/input/input.directive';

@Component({
  selector: 'app-create-payment-method-modal',
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
    ZardInputDirective,
  ],
  templateUrl: './create-payment-method-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePaymentMethodModal {
  private fb = inject(FormBuilder);
  private firestore = inject(FirestoreService);

  form: FormGroup;
  loading = signal(false);

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
      fees: this.fb.array([])
    });

    // Add initial fee row
    this.addFee();
  }

  get fees() {
    return this.form.get('fees') as FormArray;
  }

  addFee() {
    const feeGroup = this.fb.group({
      installments: [1, [Validators.required, Validators.min(1)]],
      fee: [0, [Validators.required, Validators.min(0)]]
    });
    this.fees.push(feeGroup);
  }

  removeFee(index: number) {
    this.fees.removeAt(index);
  }

  async create() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    try {
      await this.firestore.createDocument('payment-methods', this.form.value);
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw error;
    } finally {
      this.loading.set(false);
    }
  }
}
