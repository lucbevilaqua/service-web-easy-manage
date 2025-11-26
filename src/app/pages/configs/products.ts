import { BaseListPageConfig } from "@shared/bases/base-list-page/base-list.interfaces";

export const productsConfig: BaseListPageConfig = {
  title: 'Produtos',
  subtitle: 'Gerencie o cadastro e estoque de produtos.',
  pathDb: 'products',
  pageSize: 10,
  orderByField: 'name',
  orderByDirection: 'asc',
  columns: [
    {
      type: 'text',
      label: 'Nome do Produto',
      key: 'name',
      class: 'w-64'
    },
    {
      type: 'text',
      label: 'Categoria',
      key: 'category',
      class: 'w-40'
    },
    {
      type: 'text',
      label: 'Estoque',
      key: 'currentStock',
      class: 'w-40',
      format: (value: string, row: any) => `${row.currentStock} / ${row.minStock} ${row.unit}`
    },
    {
      type: 'badge',
      label: 'Status',
      key: 'status',
      class: 'w-32',
      color: (row: any) => {
        const current = Number(row.currentStock);
        const min = Number(row.minStock);
        if (current === 0) return 'destructive';
        if (current <= min) return 'warning';
        return 'success';
      },
      format: (value: string, row: any) => {
        const current = Number(row.currentStock);
        const min = Number(row.minStock);
        if (current === 0) return 'Esgotado';
        if (current <= min) return 'Baixo';
        return 'Ok';
      }
    }
  ],
  filters: [
    {
      key: 'name',
      label: 'Nome do Produto',
      type: 'text',
      placeholder: 'Filtrar por nome'
    },
    {
      key: 'category',
      label: 'Categoria',
      type: 'text',
      placeholder: 'Filtrar por categoria'
    }
  ],
  createConfig: [
    {
      key: 'name',
      label: 'Nome do Produto',
      type: 'text',
      placeholder: 'Nome do produto',
      required: true
    },
    {
      key: 'category',
      label: 'Categoria',
      type: 'text',
      placeholder: 'Categoria do produto',
      required: true
    },
    {
      key: 'unit',
      label: 'Unidade de Medida',
      type: 'select',
      placeholder: 'Selecione a unidade',
      required: true,
      options: [
        { label: 'Unidade', value: 'Unidade' },
        { label: 'Caixa', value: 'Caixa' },
        { label: 'Pacote', value: 'Pacote' },
        { label: 'kg', value: 'kg' },
        { label: 'g', value: 'g' },
        { label: 'Litro', value: 'Litro' },
        { label: 'ml', value: 'ml' },
        { label: 'Metro', value: 'Metro' },
        { label: 'cm', value: 'cm' }
      ]
    },
    {
      key: 'currentStock',
      label: 'Estoque Atual',
      type: 'number',
      placeholder: '0',
      required: true
    },
    {
      key: 'minStock',
      label: 'Estoque Mínimo',
      type: 'number',
      placeholder: '0',
      required: true
    }
  ]
};
