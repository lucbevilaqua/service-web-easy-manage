import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { AppLayout } from '@shared/containers/app-layout/app-layout';
import { contractConfig } from './pages/configs/contract';

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
        path: 'contracts',
        loadComponent: () => import('./shared/bases/base-list-page/base-list-page').then(m => m.BaseListPage),
        data: {
          config: contractConfig,
        }
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
];
