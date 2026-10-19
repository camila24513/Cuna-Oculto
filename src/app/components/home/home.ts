import { Component } from '@angular/core';
import { CategoriesCard } from '../categories-card/categories-card';

@Component({
  selector: 'app-home',
  imports: [CategoriesCard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {}

