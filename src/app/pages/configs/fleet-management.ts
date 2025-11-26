import { BaseListPageConfig } from "@shared/bases/base-list-page/base-list.interfaces";

export const fleetManagementConfig: BaseListPageConfig = {
  title: 'Gerenciamento de Frota',
  subtitle: 'Gerencie a manutenção e custos da frota de veículos.',
  pathDb: 'fleet-management',
  pageSize: 10,
  orderByField: 'maintenanceDate',
  orderByDirection: 'desc',
  columns: [
    {
      type: 'text',
      label: 'Nome do Veículo',
      key: 'vehicleName',
      class: 'w-48'
    },
    {
      type: 'text',
      label: 'Placa',
      key: 'plate',
      class: 'w-32'
    },
    {
      type: 'date',
      label: 'Data da Manutenção',
      key: 'maintenanceDate',
      class: 'w-40',
      format: 'short'
    },
    {
      type: 'number',
      label: 'Custo',
      key: 'cost',
      class: 'w-32',
      format: 'currency'
    },
    {
      type: 'text',
      label: 'Descrição do Serviço',
      key: 'serviceDescription',
      class: 'w-64'
    },
    {
      type: 'badge',
      label: 'Manutenção Realizada?',
      key: 'maintenancePerformed',
      class: 'w-40',
      color: (row: any) => row.maintenancePerformed === 'Sim' ? 'success' : 'warning'
    }
  ],
  filters: [
    {
      key: 'vehicleName',
      label: 'Nome do Veículo',
      type: 'text',
      placeholder: 'Filtrar por nome'
    },
    {
      key: 'plate',
      label: 'Placa',
      type: 'text',
      placeholder: 'Filtrar por placa'
    },
    {
      key: 'maintenancePerformed',
      label: 'Manutenção Realizada?',
      type: 'select',
      placeholder: 'Selecione',
      options: [
        { label: 'Sim', value: 'Sim' },
        { label: 'Não', value: 'Não' }
      ]
    }
  ],
  createConfig: [
    {
      key: 'vehicleName',
      label: 'Nome do Veículo',
      type: 'text',
      placeholder: 'Nome do veículo',
      required: true
    },
    {
      key: 'plate',
      label: 'Placa',
      type: 'text',
      placeholder: 'ABC-1234',
      required: true
    },
    {
      key: 'maintenanceDate',
      label: 'Data da Manutenção',
      type: 'date',
      required: true
    },
    {
      key: 'cost',
      label: 'Custo (R$)',
      type: 'number',
      placeholder: '0.00',
      required: true
    },
    {
      key: 'maintenancePerformed',
      label: 'Manutenção Realizada?',
      type: 'radio',
      required: true,
      options: [
        { label: 'Sim', value: 'Sim' },
        { label: 'Não', value: 'Não' }
      ]
    },
    {
      key: 'serviceDescription',
      label: 'Descrição do Serviço',
      type: 'textarea',
      placeholder: 'Descreva o serviço realizado',
      required: true,
      colSpan: 2
    }
  ]
};
