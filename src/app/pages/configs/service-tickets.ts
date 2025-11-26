import { BaseListPageConfig } from "@shared/bases/base-list-page/base-list.interfaces";

export const serviceTicketsConfig: BaseListPageConfig = {
  title: 'Chamados de Serviço',
  subtitle: 'Visualize e gerencie todos os chamados de serviço técnico.',
  pathDb: 'service-tickets',
  pageSize: 10,
  orderByField: 'openDate',
  orderByDirection: 'desc',
  columns: [
    {
      type: 'text',
      label: 'Contrato',
      key: 'contractId',
      class: 'w-32'
    },
    {
      type: 'date',
      label: 'Data Abertura',
      key: 'openDate',
      class: 'w-32',
      format: 'short'
    },
    {
      type: 'date',
      label: 'Data Prevista',
      key: 'expectedDate',
      class: 'w-32',
      format: 'short'
    },
    {
      type: 'text',
      label: 'Número AR',
      key: 'arNumber',
      class: 'w-28'
    },
    {
      type: 'text',
      label: 'Sala/Ambiente',
      key: 'roomName',
      class: 'w-32'
    },
    {
      type: 'text',
      label: 'Unidade',
      key: 'unitName',
      class: 'w-40'
    },
    {
      type: 'badge',
      label: 'Status',
      key: 'status',
      class: 'w-28',
      color: (row: any) => {
        if (row.status === 'Atendido') return 'success';
        if (row.status === 'Pendente') return 'warning';
        return 'neutral';
      }
    },
    {
      type: 'badge',
      label: 'Concluído',
      key: 'completed',
      class: 'w-24',
      color: (row: any) => row.completed === 'Sim' ? 'success' : 'neutral',
      format: (value: string) => value || 'Não'
    }
  ],
  filters: [
    {
      key: 'contractId',
      label: 'Contrato',
      type: 'select',
      placeholder: 'Filtrar por contrato',
      listEntity: 'contracts',
      listMapFn: (data: any) => ({
        value: data.id,
        label: data.contractName || data.id
      })
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Selecione o status',
      options: [
        { label: 'Atendido', value: 'Atendido' },
        { label: 'Pendente', value: 'Pendente' }
      ]
    },
    {
      key: 'completed',
      label: 'Concluído',
      type: 'select',
      placeholder: 'Selecione',
      options: [
        { label: 'Sim', value: 'Sim' },
        { label: 'Não', value: 'Não' }
      ]
    },
    {
      key: 'equipmentCondemned',
      label: 'Equipamento Condenado',
      type: 'select',
      placeholder: 'Selecione',
      options: [
        { label: 'Sim', value: 'Sim' },
        { label: 'Não', value: 'Não' }
      ]
    },
    {
      key: 'unitName',
      label: 'Unidade de Atendimento',
      type: 'text',
      placeholder: 'Filtrar por unidade'
    }
  ],
  createConfig: [
    {
      key: 'contractId',
      label: 'Contrato',
      type: 'select',
      placeholder: 'Selecione um contrato',
      required: true,
      listEntity: 'contracts',
      listMapFn: (data: any) => ({
        value: data.id,
        label: `${data.cnpj || data.id} - ${data.contractName}`
      })
    },
    {
      key: 'openDate',
      label: 'Data de Abertura',
      type: 'date',
      required: true
    },
    {
      key: 'expectedDate',
      label: 'Data Prevista Atendimento',
      type: 'date',
      required: true
    },
    {
      key: 'arNumber',
      label: 'Número da AR',
      type: 'text',
      placeholder: 'Número da AR',
      required: false
    },
    {
      key: 'roomName',
      label: 'Nome da Sala/Ambiente',
      type: 'text',
      placeholder: 'Ex: Sala 101',
      required: true
    },
    {
      key: 'unitName',
      label: 'Nome da Unidade de Atendimento',
      type: 'text',
      placeholder: 'Ex: Unidade Central',
      required: true
    },
    {
      key: 'serviceAddress',
      label: 'Endereço de Atendimento',
      type: 'textarea',
      placeholder: 'Endereço completo',
      required: true,
      colSpan: 2
    },
    {
      key: 'clientDiagnosis',
      label: 'Diagnóstico do Cliente',
      type: 'textarea',
      placeholder: 'Descrição do problema relatado pelo cliente',
      required: true,
      colSpan: 2
    },
    {
      key: 'realDiagnosis',
      label: 'Diagnóstico Real',
      type: 'textarea',
      placeholder: 'Diagnóstico técnico real',
      required: false,
      colSpan: 2
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Selecione o status',
      required: true,
      options: [
        { label: 'Atendido', value: 'Atendido' },
        { label: 'Pendente', value: 'Pendente' }
      ]
    },
    {
      key: 'equipmentCondemned',
      label: 'Equipamento Condenado?',
      type: 'radio',
      required: true,
      options: [
        { label: 'Sim', value: 'Sim' },
        { label: 'Não', value: 'Não' }
      ]
    },
    {
      key: 'completed',
      label: 'Concluído?',
      type: 'radio',
      required: true,
      options: [
        { label: 'Sim', value: 'Sim' },
        { label: 'Não', value: 'Não' }
      ]
    },
    {
      key: 'observations',
      label: 'Observações',
      type: 'textarea',
      placeholder: 'Observações adicionais',
      required: false,
      colSpan: 2
    }
  ]
};
