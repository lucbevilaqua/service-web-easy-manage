import { ZardBadgeVariants } from "src/app/ui/components/badge/badge.variants";
import { CreateConfig } from "@shared/components/create-modal/create-modal.interfaces";
import { ZardIcon } from "src/app/ui/components/icon/icons";

export type BadgeColorFn = (row: any) => ZardBadgeVariants['zType'];

export interface ColumnBase {
  type?: 'text' | 'badge' | 'actions' | 'date' | 'number' | 'boolean';
  label: string;
  key: string;
  class?: string;
  hiddenOnMobile?: boolean;
  format?: ((value: any, row: any) => string) | string;
}

export interface TextColumn extends ColumnBase {
  type?: 'text';
}

export interface BadgeColumn extends ColumnBase {
  type: 'badge';
  color: ZardBadgeVariants['zType'] | BadgeColorFn;
}

export interface DateColumn extends ColumnBase {
  type: 'date';
  format?: 'short' | 'medium' | 'long' | 'full' | string;
}

export interface NumberColumn extends ColumnBase {
  type: 'number';
  format?: 'currency' | 'decimal' | 'percent' | string;
  decimals?: number;
}

export interface BooleanColumn extends ColumnBase {
  type: 'boolean';
  trueLabel?: string;
  falseLabel?: string;
}

export interface ActionColumn extends ColumnBase {
  type: 'actions';
  actions: Array<{
    id: string;
    tooltip?: string;
    icon: ZardIcon;
  }>;
}

export type Column = TextColumn | BadgeColumn | DateColumn | NumberColumn | BooleanColumn | ActionColumn;

export interface BaseListPageConfig {
  title: string;
  subtitle?: string;
  columns: Column[];
  pathDb: string; // Firestore collection path (without leading slash)
  pageSize?: number; // Default: 10
  orderByField?: string;
  orderByDirection?: 'asc' | 'desc';
  filters?: FilterConfig[];
  createConfig?: CreateConfig[];
}

// Filter types
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

export interface AppliedFilter {
  key: string;
  value: any;
  operator?: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'array-contains-any';
}

