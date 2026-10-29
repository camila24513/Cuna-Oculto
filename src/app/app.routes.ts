import { Routes } from '@angular/router';
import { CategoriesCardComponent } from './components/categories-card/categories-card';
import { ListadoHistoriasComponent } from './pages/listado-historias/listado-historias';

export const routes: Routes = [
  { path: 'categorias', component: CategoriesCardComponent },
  { path: 'categorias/:nombre', component: ListadoHistoriasComponent },
  { path: 'historias', component: ListadoHistoriasComponent },
  { path: '', redirectTo: 'categorias', pathMatch: 'full' }
];