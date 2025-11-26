import { BaseListPageConfig } from "@shared/bases/base-list-page/base-list.interfaces";

export const stockMovementConfig: BaseListPageConfig = {
  title: 'Movimentação de Estoque',
  subtitle: 'Gerencie as entradas e saídas de produtos do estoque.',
  pathDb: 'stock-movements',
  pageSize: 10,
  orderByField: 'createdAt',
  orderByDirection: 'desc',
  columns: [
    {
      type: 'text',
      label: 'Produto',
      key: 'productName',
      class: 'w-64'
    },
    {
      type: 'badge',
      label: 'Tipo',
      key: 'type',
      class: 'w-32',
      color: (row: any) => row.type === 'Entrada' ? 'success' : 'destructive'
    },
    {
      type: 'text',
      label: 'Quantidade',
      key: 'quantity',
      class: 'w-32'
    },
    {
      type: 'text',
      label: 'Responsável',
      key: 'responsible',
      class: 'w-48'
    },
    {
      type: 'text',
      label: 'Fornecedor',
      key: 'supplier',
      class: 'w-48'
    }
  ],
  filters: [
    {
      key: 'productId',
      label: 'Produto',
      type: 'combobox',
      placeholder: 'Filtrar por produto',
      listEntity: 'products',
      listMapFn: (data: any) => ({
        value: data.id,
        label: data.name
      })
    },
    {
      key: 'type',
      label: 'Tipo de Movimentação',
      type: 'select',
      placeholder: 'Selecione o tipo',
      options: [
        { label: 'Entrada', value: 'Entrada' },
        { label: 'Saída', value: 'Saída' }
      ]
    },
    {
      key: 'responsible',
      label: 'Responsável',
      type: 'text',
      placeholder: 'Filtrar por responsável'
    }
  ],
  createConfig: [
    {
      key: 'productId',
      label: 'Produto',
      type: 'combobox',
      placeholder: 'Selecione um produto',
      required: true,
      listEntity: 'products',
      listMapFn: (data: any) => ({
        value: data.id,
        label: `${data.name}`
      })
    },
    {
      key: 'type',
      label: 'Tipo de Movimentação',
      type: 'radio',
      required: true,
      options: [
        { label: 'Entrada', value: 'Entrada' },
        { label: 'Saída', value: 'Saída' }
      ]
    },
    {
      key: 'quantity',
      label: 'Quantidade',
      type: 'number',
      placeholder: '0',
      required: true
    },
    {
      key: 'responsible',
      label: 'Responsável',
      type: 'text',
      placeholder: 'Nome do responsável',
      required: true
    },
    {
      key: 'supplier',
      label: 'Fornecedor',
      type: 'text',
      placeholder: 'Nome do fornecedor',
      required: false
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
