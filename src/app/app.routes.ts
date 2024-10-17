import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { ConfigComponent } from './config/config.component';
import { hasSessionGuard } from './guards/has-session.guard';
import { LoginComponent } from './auth/login/login.component';
import { SavingsComponent } from './savings/savings.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RegisterComponent } from './auth/register/register.component';
import { AccountsComponent } from './accounts/view-accounts/accounts.component';
import { AddAccountComponent } from './accounts/add-account/add-account.component';
import { AddMovementComponent } from './accounts/add-movement/add-movement.component';
import { CardPositionChangerComponent } from './accounts/card-position-changer/card-position-changer.component';

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
        children: [
          {
            path: 'order-accounts',
            loadComponent: () => import('./accounts/card-position-changer/card-position-changer.component').then(()=> CardPositionChangerComponent),
          },
        ]
      },
      {
        path: 'add-movement',
        loadComponent: () => import('./accounts/add-movement/add-movement.component').then(()=> AddMovementComponent),
      },
      {
        path: 'calendar',
        loadComponent: () => import('./calendar/calendar.component').then(()=> CalendarComponent),
      },
      {
        path: 'savings',
        loadComponent: () => import('./savings/savings.component').then(() => SavingsComponent)
      },
      {
        path: 'config',
        loadComponent: () => import('./config/config.component').then(() => ConfigComponent)
      },
      {
        path: '',
        redirectTo: 'accounts',
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
