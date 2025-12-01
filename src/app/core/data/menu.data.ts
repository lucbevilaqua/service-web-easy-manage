import { MenuGroup } from "@shared/containers/sidebar-content/sidebar-content";

export const MENU_DATA: MenuGroup[] = [
  {
    name: 'Principal',
    items: [
      { label: 'Dashboard', route: '/dashboard', icon: 'layout-dashboard' },
    ],
  },
  {
    name: 'Gestão Operacional',
    items: [
      { label: 'Contratos', route: '/contracts', icon: 'file-text' },
      { label: 'Produtos', route: '/products', icon: 'package' },
      { label: 'Chamados', route: '/service-tickets', icon: 'clipboard' },
      { label: 'Solicitações de Compra', route: '/purchase-requests', icon: 'shopping-cart' },
      { label: 'Movimentação', route: '/stock-movements', icon: 'arrow-left-right' },
      { label: 'Gerenciamento de Frota', route: '/fleet-management', icon: 'truck' },
    ],
  },
  {
    name: 'Financeiro',
    items: [
      { label: 'Formas de Pagamento', route: '/payment-methods', icon: 'credit-card' },
      { label: 'Calculadora de Taxas', route: '/fee-calculator', icon: 'calculator' },
    ],
  },
]

