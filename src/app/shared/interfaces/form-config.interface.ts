import { ZardComboboxOption } from "@ui/components/combobox/combobox.component";

export type FormFieldType = 'text'
  | 'date'
  | 'select'
  | 'number'
  | 'checkbox'
  | 'textarea'
  | 'radio'
  | 'switch'
  | 'combobox';

export interface DynamicFieldConfig {
  key: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: ZardComboboxOption[]; // For select type
  defaultValue?: any;
  min?: number | string; // For number
  max?: number | string; // For number
  step?: number; // For number
  colSpan?: number; // Grid column span (1-4)
  listEntity?: string; // Firestore collection path for dynamic options
  listMapFn?: (data: any) => ZardComboboxOption; // Map function to transform Firestore data to options
}
