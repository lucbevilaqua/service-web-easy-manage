import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { AppLayout } from '@shared/containers/app-layout/app-layout';
import { contractConfig } from './pages/configs/contract';
import { dashboardConfig } from './pages/configs/dashboard';
import { serviceTicketsConfig } from './pages/configs/service-tickets';

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
    component: AppLayout,
    canActivate: [authGuardFn],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./shared/bases/base-dashboard/base-dashboard-page').then(m => m.BaseDashboardPage),
        canActivate: [authGuardFn],
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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
];
