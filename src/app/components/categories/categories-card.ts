import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories-card.html',
  styleUrls: ['./categories-card.css']
})
export class CategoriesCardComponent {
  categorias = [
    {
      nombre: 'Mitos Dolorenses',
      desc: 'Relatos tradicionales del pueblo y el centro histórico.',
      img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600'
    },
    {
      nombre: 'Mitos escolares',
      desc: 'Historias espeluznantes que suceden en los pasillos al caer la noche.',
      img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600'
    },
    {
      nombre: 'Mitos escondidos',
      desc: 'Secretos antiguos y pasadizos poco conocidos por la gente.',
      img: 'https://images.unsplash.com/photo-1519074069444-1ba4edd16be1?q=80&w=600'
    }
  ];
}