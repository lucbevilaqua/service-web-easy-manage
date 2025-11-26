import { BaseListPageConfig } from "@shared/bases/base-list-page/base-list.interfaces";

export const purchaseRequestsConfig: BaseListPageConfig = {
  title: 'Solicitações de Compra',
  subtitle: 'Gerencie as solicitações de compra de materiais e equipamentos.',
  pathDb: 'purchase-requests',
  pageSize: 10,
  orderByField: 'createdAt',
  orderByDirection: 'desc',
  columns: [
    {
      type: 'text',
      label: 'Solicitante',
      key: 'requester',
      class: 'w-40'
    },
    {
      type: 'text',
      label: 'Destino',
      key: 'destination',
      class: 'w-40'
    },
    {
      type: 'text',
      label: 'Descrição do Item',
      key: 'itemDescription',
      class: 'w-64'
    },
    {
      type: 'text',
      label: 'Qtd',
      key: 'quantity',
      class: 'w-20'
    },
    {
      type: 'date',
      label: 'Previsão Entrega',
      key: 'deliveryForecast',
      class: 'w-32',
      format: 'short'
    },
    {
      type: 'text',
      label: 'Cód. Orçamento',
      key: 'budgetCode',
      class: 'w-32'
    }
  ],
  filters: [
    {
      key: 'requester',
      label: 'Solicitante',
      type: 'text',
      placeholder: 'Filtrar por solicitante'
    },
    {
      key: 'destination',
      label: 'Destino',
      type: 'text',
      placeholder: 'Filtrar por destino'
    },
    {
      key: 'budgetCode',
      label: 'Código do Orçamento',
      type: 'text',
      placeholder: 'Filtrar por código'
    }
  ],
  createConfig: [
    {
      key: 'requester',
      label: 'Solicitante',
      type: 'text',
      placeholder: 'Nome do solicitante',
      required: true
    },
    {
      key: 'destination',
      label: 'Destino',
      type: 'text',
      placeholder: 'Destino do material/equipamento',
      required: true
    },
    {
      key: 'itemDescription',
      label: 'Descrição do Item',
      type: 'textarea',
      placeholder: 'Descrição detalhada do item',
      required: true,
      colSpan: 2
    },
    {
      key: 'quantity',
      label: 'Quantidade',
      type: 'number',
      placeholder: '0',
      required: true
    },
    {
      key: 'modelPartNumber',
      label: 'Modelo/Part Number',
      type: 'text',
      placeholder: 'Modelo ou número da peça',
      required: false
    },
    {
      key: 'budgetCode',
      label: 'Código do Orçamento',
      type: 'text',
      placeholder: 'Código do orçamento relacionado',
      required: false
    },
    {
      key: 'deliveryForecast',
      label: 'Previsão de Entrega',
      type: 'date',
      required: true
    },
    {
      key: 'observation',
      label: 'Observação',
      type: 'textarea',
      placeholder: 'Observações adicionais',
      required: false,
      colSpan: 2
    }
  ]
};
