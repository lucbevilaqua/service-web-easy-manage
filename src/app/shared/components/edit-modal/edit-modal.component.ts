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
import { FormConfig } from '@shared/interfaces/form-config.interface';
import { Z_MODAL_DATA } from '@ui/components/dialog/dialog.service';

interface EditDialogData {
  config: FormConfig[];
  pathDb: string;
  item: any;
}

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DynamicFormComponent
  ],
  templateUrl: './edit-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditModalComponent implements OnInit {
  private data: EditDialogData = inject(Z_MODAL_DATA);
  private fb = inject(FormBuilder);
  private firestoreService = inject(FirestoreService);

  readonly config = signal(this.data.config);
  readonly pathDb = signal(this.data.pathDb);
  readonly item = signal(this.data.item);
  
  form!: FormGroup;
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const group: any = {};
    const itemData = this.item();
    
    this.config().forEach(field => {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      
      const value = itemData[field.key] ?? field.defaultValue ?? '';
      group[field.key] = [value, validators];
    });

    this.form = this.fb.group(group);
  }

  async update(): Promise<void> {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const data = this.form.value;
      // We need the document ID to update. Assuming it's in the item data as 'id'.
      const docId = this.item().id;
      if (!docId) {
        throw new Error('Document ID is missing');
      }

      // We need a method in FirestoreService to update a document.
      // Assuming updateDocument(path: string, id: string, data: any) exists or I need to create it.
      // Checking FirestoreService... it has deleteDocument and createDocument. I need to add updateDocument.
      // For now I will assume I need to add it.
      
      await this.firestoreService.updateDocument(this.pathDb(), docId, data);
      
    } catch (err: any) {
      console.error('Error updating item:', err);
      this.error.set(err.message || 'Error updating item');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }
}
