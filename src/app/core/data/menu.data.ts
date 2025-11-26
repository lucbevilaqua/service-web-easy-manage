import { MenuGroup } from "@shared/containers/sidebar-content/sidebar-content";

export const MENU_DATA: MenuGroup[] = [
  {
    name: 'Geral',
    items: [
      { label: 'Dashboard', route: '/dashboard', icon: 'layout-dashboard' },
      { label: 'Contratos', route: '/contracts', icon: 'file-text' },
      { label: 'Chamados', route: '/service-tickets', icon: 'clipboard' },
      { label: 'Solicitações de Compra', route: '/purchase-requests', icon: 'shopping-cart' },
      { label: 'Produtos', route: '/products', icon: 'package' },
    ],
  },
]

