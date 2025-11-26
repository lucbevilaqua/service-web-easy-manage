import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { contractConfig } from './pages/configs/contract';
import { dashboardConfig } from './pages/configs/dashboard';
import { serviceTicketsConfig } from './pages/configs/service-tickets';
import { purchaseRequestsConfig } from './pages/configs/purchase-requests';
import { productsConfig } from './pages/configs/products';
import { stockMovementConfig } from './pages/configs/stock-movement';
import { fleetManagementConfig } from './pages/configs/fleet-management';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  { 
    path: 'not-authorized',
    loadComponent: () => import('./pages/not-authorized/not-authorized').then(m => m.NotAuthorized)
  },
  {
    path: '',
    loadComponent: () => import('./shared/containers/app-layout/app-layout').then(m => m.AppLayout),
    canActivate: [authGuardFn],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./shared/bases/base-dashboard/base-dashboard-page').then(m => m.BaseDashboardPage),
        data: {
          config: dashboardConfig,
        }
      },
      {
        path: 'contracts',
        loadComponent: () => import('./shared/bases/base-list-page/base-list-page').then(m => m.BaseListPage),
        data: {
          config: contractConfig,
        }
      },
      {
        path: 'service-tickets',
        loadComponent: () => import('./shared/bases/base-list-page/base-list-page').then(m => m.BaseListPage),
        data: {
          config: serviceTicketsConfig,
        }
      },
      {
        path: 'purchase-requests',
        loadComponent: () => import('./shared/bases/base-list-page/base-list-page').then(m => m.BaseListPage),
        data: {
          config: purchaseRequestsConfig,
        }
      },
      {
        path: 'products',
        loadComponent: () => import('./shared/bases/base-list-page/base-list-page').then(m => m.BaseListPage),
        data: {
          config: productsConfig,
        }
      },
      {
        path: 'stock-movements',
        loadComponent: () => import('./shared/bases/base-list-page/base-list-page').then(m => m.BaseListPage),
        data: {
          config: stockMovementConfig,
        }
      },
      {
        path: 'fleet-management',
        loadComponent: () => import('./shared/bases/base-list-page/base-list-page').then(m => m.BaseListPage),
        data: {
          config: fleetManagementConfig,
        }
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
];
