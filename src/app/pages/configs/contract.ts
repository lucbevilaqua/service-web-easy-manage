import { BaseListPageConfig } from "@shared/bases/base-list-page/base-list.interfaces";

const visitPeriodList = [
  { label: 'Mensal', value: 'mensal' },
  { label: 'Bimestral', value: 'bimestral' },
  { label: 'Trimestral', value: 'trimestral' },
  { label: 'Semestral', value: 'semestral' },
  { label: 'Anual', value: 'anual' },
];

const cityList = [
  { label: 'Rio Claro', value: 'rioClaro' },
  { label: 'Santa Catarina', value: 'santaCatarina' },
  { label: 'Araras', value: 'araras' },
  { label: 'Limeira', value: 'limeira' },
  { label: 'Capinas', value: 'capinas' },
  { label: 'Piracicaba', value: 'piracicaba' },
  { label: 'São Carlos', value: 'saoCarlos' },
  { label: 'Indaiatuba', value: 'indaiatuba' },
];

const typeList = [
  { label: 'Privado', value: 'privado' },
  { label: 'Publico', value: 'publico' }
];

export const contractConfig: BaseListPageConfig = {
  title: 'Contratos',
  subtitle: 'Visualize e gerencie todos os seus contratos de serviço.',
  pathDb: 'contracts',
  pageSize: 10,
  orderByField: 'contractName',
  orderByDirection: 'desc',
  columns: [
    {
      type: 'text',
      label: 'Contrato',
      key: 'contractName',
    },
    {
      type: 'text',
      label: 'CNPJ',
      key: 'cnpj',
    },
    {
      type: 'text',
      label: 'Cidade',
      key: 'city',
    },
    {
      type: 'badge',
      label: 'Tipo',
      key: 'type',
      color: (row) => row.type === 'privado' ? 'info' : 'neutral'
    },
    {
      type: 'badge',
      label: 'Periodo',
      key: 'visitPeriod',
      color: (row) => {
        switch (row.visitPeriod) {
          case 'mensal': return 'success';
          case 'bimestral': return 'info';
          case 'trimestral': return 'warning';
          case 'semestral': return 'secondary';
          case 'anual': return 'neutral';
          default: return 'outline';
        }
      }
    },
    {
      type: 'badge',
      label: 'Status',
      key: 'status',
      color: (row) => {
        if (!row.validUntil) return 'neutral';
        const validUntil = row.validUntil.toDate ? row.validUntil.toDate() : new Date(row.validUntil);
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        if (validUntil < today) return 'destructive';
        return validUntil < thirtyDaysFromNow ? 'warning' : 'success';
      },
      format: (value, row) => {
        if (!row.validUntil) return 'N/A';
        const validUntil = row.validUntil.toDate ? row.validUntil.toDate() : new Date(row.validUntil);
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        if (validUntil < today) return 'Expirado';
        return validUntil < thirtyDaysFromNow ? 'Expira em breve' : 'Vigente';
      }
    },
    {
      type: 'date',
      label: 'Vigência',
      key: 'validUntil',
      format: 'short',
      hiddenOnMobile: true
    },
  ],
  filters: [
    {
      key: 'cnpj',
      label: 'CNPJ',
      type: 'text',
    },
    {
      key: 'type',
      label: 'Tipo',
      type: 'select',
      options: typeList,
    },
    {
      key: 'visitPeriod',
      label: 'Periodo',
      type: 'select',
      options: visitPeriodList,
    },
    {
      key: 'city',
      label: 'Cidade',
      type: 'select',
      options: cityList,
    }
  ],
  createConfig: [
    {
      key: 'contractName',
      label: 'Name',
      type: 'text',
      required: true
    },
    {
      key: 'cnpj',
      label: 'CNPJ',
      type: 'text',
      required: true
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      options: typeList,
      required: true
    },
    {
      key: 'visitPeriod',
      label: 'Periodo da visita',
      type: 'select',
      options: visitPeriodList,
      required: true
    },
    {
      key: 'validUntil',
      label: 'Vigência até',
      type: 'date',
      required: true  
    },
    {
      key: 'city',
      label: 'Cidade',
      type: 'select',
      options: cityList,
      required: true
    }
  ],
}
