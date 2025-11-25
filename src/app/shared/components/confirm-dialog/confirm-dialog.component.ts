import { 
  ChangeDetectionStrategy, 
  Component, 
  input, 
  output, 
  model 
} from '@angular/core';
import { ZardButtonComponent, ZardIconComponent } from '@ui/components';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    ZardButtonComponent,
    ZardIconComponent
  ],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  // Input signals
  readonly isOpen = model<boolean>(false);
  readonly title = input<string>('Confirm Action');
  readonly message = input<string>('Are you sure you want to proceed?');
  readonly confirmText = input<string>('Confirm');
  readonly cancelText = input<string>('Cancel');
  readonly confirmType = input<'default' | 'destructive'>('destructive');

  // Output signals
  readonly onConfirm = output<void>();
  readonly onCancel = output<void>();

  handleConfirm(): void {
    this.onConfirm.emit();
    this.isOpen.set(false);
  }

  handleCancel(): void {
    this.onCancel.emit();
    this.isOpen.set(false);
  }
}

