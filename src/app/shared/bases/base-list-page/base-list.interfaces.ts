import { ZardBadgeVariants } from "@shared/components/badge/badge.variants";
import { ZardIcon } from "@shared/components/icon/icons";

export type BadgeColorFn = (row: any) => ZardBadgeVariants['zType'];

export interface ColumnBase {
  type?: string;
  label: string;
  field: string;
  class?: string;
}

export interface ActionColumn extends ColumnBase {
  type: 'actions';
  actions: Array<{
    id: string;
    tooltip?: string;
    icon: ZardIcon;
  }>;
}

export interface BadgeColumn extends ColumnBase {
  type: 'badge';
  color:  ZardBadgeVariants['zType'] | BadgeColorFn;
}

export type Column = BadgeColumn | ColumnBase | ActionColumn;
