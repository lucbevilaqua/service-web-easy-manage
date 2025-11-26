import { DashboardConfig } from "@shared/bases/base-dashboard/dashboard.interfaces";

export const dashboardConfig: DashboardConfig = {
  title: 'Dashboard',
  subtitle: 'Visão geral dos contratos',
  cards: [
    {
      dbPath: 'contracts',
      type: 'counter',
      label: 'Total de Contratos',
      icon: 'file-text',
      color: 'primary',
      route: '/contracts',
      mapFn: (data: any[]) => ({
        label: 'Total de Contratos',
        value: data.length,
        icon: 'file-text',
        color: 'primary'
      })
    },
    {
      dbPath: 'contracts',
      type: 'counter',
      label: 'Contratos Vigentes',
      icon: 'check',
      color: 'success',
      route: '/contracts',
      queryParams: { status: 'vigente' },
      mapFn: (data: any[]) => {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        const count = data.filter(row => {
          if (!row.validUntil) return false;
          const validUntil = row.validUntil.toDate ? row.validUntil.toDate() : new Date(row.validUntil);
          return validUntil >= thirtyDaysFromNow;
        }).length;

        return {
          label: 'Contratos Vigentes',
          value: count,
          icon: 'check',
          color: 'success'
        };
      }
    },
    {
      dbPath: 'contracts',
      type: 'counter',
      label: 'Expira em Breve',
      icon: 'triangle-alert',
      color: 'warning',
      route: '/contracts',
      queryParams: { status: 'expiring' },
      mapFn: (data: any[]) => {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        const count = data.filter(row => {
          if (!row.validUntil) return false;
          const validUntil = row.validUntil.toDate ? row.validUntil.toDate() : new Date(row.validUntil);
          return validUntil >= today && validUntil < thirtyDaysFromNow;
        }).length;

        return {
          label: 'Expira em Breve',
          value: count,
          icon: 'triangle-alert',
          color: 'warning'
        };
      }
    },
    {
      dbPath: 'contracts',
      type: 'counter',
      label: 'Expirados',
      icon: 'circle-x',
      color: 'destructive',
      route: '/contracts',
      queryParams: { status: 'expired' },
      mapFn: (data: any[]) => {
        const today = new Date();
        
        const count = data.filter(row => {
          if (!row.validUntil) return false;
          const validUntil = row.validUntil.toDate ? row.validUntil.toDate() : new Date(row.validUntil);
          return validUntil < today;
        }).length;

        return {
          label: 'Expirados',
          value: count,
          icon: 'circle-x',
          color: 'destructive'
        };
      }
    },
    {
      dbPath: 'contracts',
      type: 'chart',
      label: 'Contratos por Tipo',
      colSpan: 2,
      mapFn: (data: any[]) => {
        const privateCount = data.filter(d => d.type === 'Privado').length;
        const publicCount = data.filter(d => d.type === 'Publico').length;

        return {
          label: 'Contratos por Tipo',
          value: data.length,
          chartType: 'bar',
          chartData: {
            labels: ['Privado', 'Público'],
            datasets: [
              {
                data: [privateCount, publicCount],
                label: 'Quantidade',
                backgroundColor: ['oklch(0.65 0.18 255)', 'oklch(0.25 0.04 261.67)'], // Primary and Secondary colors
                borderColor: ['oklch(0.65 0.18 255)', 'oklch(0.25 0.04 261.67)'],
              }
            ]
          }
        };
      }
    }
  ]
};
