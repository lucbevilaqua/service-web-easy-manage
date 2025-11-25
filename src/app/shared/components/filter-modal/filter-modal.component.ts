import { 
  ChangeDetectionStrategy, 
  Component, 
  signal, 
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { FormConfig } from '@shared/interfaces/form-config.interface';
import { Z_MODAL_DATA } from '@ui/components/dialog/dialog.service';

interface FilterDialogData {
  config: FormConfig[];
  initialValues?: Record<string, any>;
}

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DynamicFormComponent
  ],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterModalComponent implements OnInit {
  private data: FilterDialogData = inject(Z_MODAL_DATA);
  private fb = inject(FormBuilder);

  readonly config = signal(this.data.config);
  
  form!: FormGroup;
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const group: any = {};
    const initialValues = this.data.initialValues || {};
    
    this.config().forEach(field => {
      const value = initialValues[field.key] ?? field.defaultValue ?? '';
      group[field.key] = [value];
    });

    this.form = this.fb.group(group);
  }

  getFilters(): Record<string, any> {
    return this.form.value;
  }

  clearAllFilters(): void {
    this.form.reset();
  }
}
