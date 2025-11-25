import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormConfig } from '@shared/interfaces/form-config.interface';
import { ZardInputGroupComponent,  ZardSelectComponent, ZardCheckboxComponent, ZardRadioComponent, ZardSwitchComponent, ZardInputDirective } from '@ui/components';
import { ZardFormModule } from 'src/app/ui/components/form/form.module';
import { ZardSelectItemComponent } from 'src/app/ui/components/select/select-item.component';
import { ZardDatePickerComponent } from '../../../ui/components/date-picker/date-picker.component';

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
    ZardDatePickerComponent
  ],
  templateUrl: './dynamic-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent {
  readonly formGroup = input.required<FormGroup>();
  readonly config = input.required<FormConfig[]>();

  trackByKey(index: number, field: FormConfig): string {
    return field.key;
  }

  getFormValue(key: string): any {
    return this.formGroup().get(key)?.value;
  }

  setFormValue(key: string, value: any): void {
    this.formGroup().get(key)?.setValue(value);
  }
}
