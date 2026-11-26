import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { CategoriesCardComponent } from './components/categories/categories-card';
import { ListadoHistoriasComponent } from './pages/listado-historias/listado-historias';
import { MapaComponent } from './pages/mapa/mapa.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent)
  },
  { path: 'home', component: HomeComponent },
  { path: 'categorias', component: CategoriesCardComponent },
  { path: 'categorias/:categoria', component: ListadoHistoriasComponent },
  {
    path: 'mis-historias',
    loadComponent: () => import('./components/mis-historias/mis-historias').then(m => m.MisHistoriasComponent)
  },
  // --- 2. Ruta corregida del Mapa ---
  {
    path: 'mapa',
    component: MapaComponent
  },
  { path: '**', redirectTo: 'home' }
];