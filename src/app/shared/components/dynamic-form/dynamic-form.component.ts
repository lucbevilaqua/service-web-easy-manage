import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormConfig } from '@shared/interfaces/form-config.interface';
import { ZardInputGroupComponent } from '@shared/components/input-group/input-group.component';
import { ZardSelectComponent } from '@shared/components/select/select.component';
import { ZardSelectItemComponent } from '@shared/components/select/select-item.component';
import { ZardCheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { ZardRadioComponent } from '@shared/components/radio/radio.component';
import { ZardSwitchComponent } from '@shared/components/switch/switch.component';
import { ZardCalendarComponent } from '@shared/components/calendar/calendar.component';
import { ZardFormModule } from '@shared/components/form/form.module';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardDatePickerComponent } from '../date-picker/date-picker.component';

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
