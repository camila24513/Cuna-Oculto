import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { CategoriesCardComponent } from './components/categories/categories-card';
import { ListadoHistoriasComponent } from './pages/listado-historias/listado-historias';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'categorias', component: CategoriesCardComponent },
  { path: 'mis-historias', component: ListadoHistoriasComponent }, // <--
  { path: 'categorias/:categoria', component: ListadoHistoriasComponent },
  // ... tus otras rutas
];