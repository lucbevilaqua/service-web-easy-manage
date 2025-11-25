export type FilterType = 'text' | 'date' | 'select' | 'range' | 'number';

export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  options?: FilterOption[]; // For select type
  min?: number | string; // For range/number
  max?: number | string; // For range/number
  step?: number; // For range/number
}

