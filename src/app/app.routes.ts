import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent) 
  },
  {
  path: 'mis-historias',
  loadComponent: () => import('./components/mis-historias/mis-historias').then(m => m.MisHistoriasComponent)
}
];