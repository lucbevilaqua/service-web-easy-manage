import { ZardIcon } from "src/app/ui/components/icon/icons";

export type DashboardCardType = 'counter' | 'chart';

export interface DashboardCardData {
  value: string | number;
  label: string;
  subLabel?: string;
  icon?: ZardIcon;
  color?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'neutral';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  chartData?: {
    labels: string[];
    datasets: {
      data: number[];
      label?: string;
      backgroundColor?: string | string[];
      borderColor?: string | string[];
    }[];
  };
  chartType?: 'line' | 'bar' | 'pie' | 'doughnut';
}

export interface DashboardCardConfig {
  dbPath: string;
  type: DashboardCardType;
  label: string;
  icon?: ZardIcon;
  color?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'neutral';
  route?: string;
  queryParams?: Record<string, any>;
  mapFn: (data: any[]) => DashboardCardData;
  colSpan?: number; // Grid column span (default 1)
}

export interface DashboardConfig {
  title: string;
  subtitle?: string;
  cards: DashboardCardConfig[];
}
