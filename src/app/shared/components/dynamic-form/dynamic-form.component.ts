import { ChangeDetectionStrategy, Component, input, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ZardInputGroupComponent,  ZardSelectComponent, ZardCheckboxComponent, ZardRadioComponent, ZardSwitchComponent, ZardInputDirective } from '@ui/components';
import { ZardFormModule } from 'src/app/ui/components/form/form.module';
import { ZardSelectItemComponent } from 'src/app/ui/components/select/select-item.component';
import { ZardDatePickerComponent } from '../../../ui/components/date-picker/date-picker.component';
import { FirestoreService } from '@core/services/firestore.service';
import { DynamicFieldConfig } from '@shared/interfaces/form-config.interface';
import { ZardComboboxComponent, ZardComboboxOption } from '@ui/components/combobox/combobox.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ZardInputGroupComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardCheckboxComponent,
    ZardRadioComponent,
    ZardSwitchComponent,
    ZardFormModule,
    ZardInputDirective,
    ZardDatePickerComponent,
    ZardComboboxComponent
  ],
  templateUrl: './dynamic-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent implements OnInit {
  private readonly firestore = inject(FirestoreService);
  
  readonly formGroup = input.required<FormGroup>();
  readonly config = input.required<DynamicFieldConfig[]>();

  // Signal to store dynamically loaded options for each field
  protected readonly dynamicOptions = new Map<string, ZardComboboxOption[]>();

  async ngOnInit(): Promise<void> {
    await this.loadDynamicLists();
  }

  private async loadDynamicLists(): Promise<void> {
    const fieldsWithDynamicLists = this.config().filter(field => field.listEntity && field.listMapFn);
    
    for (const field of fieldsWithDynamicLists) {
      try {
        const data = await this.firestore.getCollectionData(field.listEntity!);
        const options = data.map(field.listMapFn!);
        
        this.dynamicOptions.set(field.key, options);
      } catch (error) {
        console.error(`Error loading dynamic list for field ${field.key}:`, error);
      }
    }
  }

  getFieldOptions(field: DynamicFieldConfig): ZardComboboxOption[] {
    // Return dynamic options if available, otherwise return static options
    return this.dynamicOptions.get(field.key) || field.options || [];
  }

  trackByKey(index: number, field: DynamicFieldConfig): string {
    return field.key;
  }

  getFormValue(key: string): any {
    return this.formGroup().get(key)?.value;
  }

  setFormValue(key: string, value: any): void {
    this.formGroup().get(key)?.setValue(value);
  }

  getColSpanClass(field: DynamicFieldConfig): string {
    const span = field.colSpan || 1;
    switch (span) {
      case 2: return 'col-span-2';
      case 3: return 'col-span-3';
      case 4: return 'col-span-4';
      default: return 'col-span-1';
    }
  }
}
