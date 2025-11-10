import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { AppLayout } from '@shared/containers/app-layout/app-layout';

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
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
];
