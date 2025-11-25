export type CreateFieldType = 'text' | 'date' | 'select' | 'number' | 'checkbox' | 'textarea' | 'radio' | 'switch';

export interface CreateOption {
  label: string;
  value: any;
}

export interface CreateConfig {
  key: string;
  label: string;
  type: CreateFieldType;
  required?: boolean;
  placeholder?: string;
  options?: CreateOption[]; // For select type
  defaultValue?: any;
  min?: number | string; // For number
  max?: number | string; // For number
  step?: number; // For number
}
