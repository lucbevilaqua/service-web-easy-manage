import { 
  ChangeDetectionStrategy, 
  Component, 
  signal, 
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '@core/services/firestore.service';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { Z_MODAL_DATA } from '@ui/components/dialog/dialog.service';
import { DynamicFieldConfig } from '@shared/interfaces/form-config.interface';

interface CreateDialogData {
  config: DynamicFieldConfig[];
  pathDb: string;
}

@Component({
  selector: 'app-create-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DynamicFormComponent
  ],
  templateUrl: './create-modal.html',
  styleUrl: './create-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateModalComponent implements OnInit {
  private data: CreateDialogData = inject(Z_MODAL_DATA);
  private fb = inject(FormBuilder);
  private firestoreService = inject(FirestoreService);

  readonly config = signal(this.data.config);
  readonly pathDb = signal(this.data.pathDb);
  
  form!: FormGroup;
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const group: any = {};
    
    this.config().forEach(field => {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      // Add more validators based on field type if needed (e.g. min/max for numbers)

      group[field.key] = [field.defaultValue ?? '', validators];
    });

    this.form = this.fb.group(group);
  }

  async create(): Promise<void> {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const data = this.form.value;
      await this.firestoreService.createDocument(this.pathDb(), data);
      // Success handling is done by the caller (dialog close) or we can close it here if we had reference
      // But based on dialog service usage, we might need to return something or just let it finish.
      // The dialog service 'onOk' callback calls this method.
      
    } catch (err: any) {
      console.error('Error creating item:', err);
      this.error.set(err.message || 'Error creating item');
      throw err; // Re-throw so dialog service knows it failed? Or handle UI here.
    } finally {
      this.loading.set(false);
    }
  }
}

