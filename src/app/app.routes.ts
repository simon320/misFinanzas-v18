import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(()=> LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(()=> RegisterComponent)
  },
  // {
  //   path: 'dashboard',
  //   loadComponent: () => import('./dashboard/dashboard.component'),
  //   children: [
  //     {
  //       path: 'home',
  //       loadComponent: () => import('./dashboard/pages/home/home.component')
  //     },
  //     {
  //       path: 'day',
  //       loadComponent: () => import('./dashboard/pages/day/day.component')
  //     },
  //     {
  //       path: 'accounts',
  //       loadComponent: () => import('./dashboard/pages/accounts/accounts.component')
  //     },
  //     {
  //       path: 'add-account',
  //       loadComponent: () => import('./dashboard/pages/add-account/add-account.component')
  //     },
  //     {
  //       path: 'add-movement',
  //       loadComponent: () => import('./dashboard/pages/add-movement/add-movement.component')
  //     },
  //     {
  //       path: 'savings',
  //       loadComponent: () => import('./dashboard/pages/savings/savings.component')
  //     },
  //     {
  //       path: '',
  //       redirectTo: 'accounts',
  //       pathMatch: 'full'
  //     },
  //   ]
  // },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];
