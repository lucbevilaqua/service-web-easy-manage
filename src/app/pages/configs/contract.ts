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
  title: 'Dashboard',
  subtitle: 'Manage your data with ease',
  pathDb: 'contracts',
  pageSize: 10,
  orderByField: 'contractName',
  orderByDirection: 'desc',
  columns: [
    {
      type: 'badge',
      label: 'Periodo',
      key: 'visitPeriod',
      color: (row) => row.visitPeriod === 'Mensal' ? 'default' : 'destructive'
    },
    {
      type: 'text',
      label: 'Name',
      key: 'contractName'
    },
    {
      type: 'text',
      label: 'Email',
      key: 'type',
      hiddenOnMobile: true
    },
    {
      type: 'text',
      label: 'Amount',
      key: 'city',
    },
    {
      type: 'date',
      label: 'Created',
      key: 'validUntil',
      format: 'short',
      hiddenOnMobile: true
    },
  ],
  filters: [
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
