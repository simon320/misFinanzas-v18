import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { hasSessionGuard } from './guards/has-session.guard';
import { LoginComponent } from './auth/login/login.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { RegisterComponent } from './auth/register/register.component';
import { AccountsComponent } from './accounts/view-accounts/accounts.component';
import { AddAccountComponent } from './accounts/add-account/add-account.component';
import { AddMovementComponent } from './accounts/add-movement/add-movement.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [hasSessionGuard],
    loadComponent: () => import('./auth/login/login.component').then(()=> LoginComponent)
  },
  {
    path: 'register',
    canActivate: [hasSessionGuard],
    loadComponent: () => import('./auth/register/register.component').then(()=> RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./wrapper/wrapper.component').then(()=> WrapperComponent),
    children: [
      {
        path: 'add-account',
        loadComponent: () => import('./accounts/add-account/add-account.component').then(()=> AddAccountComponent),
      },
      {
        path: 'accounts',
        loadComponent: () => import('./accounts/view-accounts/accounts.component').then(()=> AccountsComponent),
      },
      {
        path: 'add-movement',
        loadComponent: () => import('./accounts/add-movement/add-movement.component').then(()=> AddMovementComponent),
      },
      // {
      //   path: 'home',
      //   loadComponent: () => import('./dashboard/pages/home/home.component')
      // },
      // {
      //   path: 'day',
      //   loadComponent: () => import('./dashboard/pages/day/day.component')
      // },
      // {
      //   path: 'savings',
      //   loadComponent: () => import('./dashboard/pages/savings/savings.component')
      // },
      {
        path: '',
        redirectTo: 'add-account',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];
