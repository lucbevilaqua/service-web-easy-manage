import { CreateFieldType, CreateOption } from '../components/create-modal/create-modal.interfaces';

export type FormFieldType = CreateFieldType;
export type FormOption = CreateOption;

export interface FormConfig {
  key: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: FormOption[]; // For select, radio
  defaultValue?: any;
  min?: number | string; // For number
  max?: number | string; // For number
  step?: number; // For number
}
