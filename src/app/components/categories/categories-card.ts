import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HistoriasService } from '../../services/historias'; // Ajusta la ruta si tu archivo no lleva .service

interface Categoria {
  titulo: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-categories-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories-card.html',
  styleUrls: ['./categories-card.css']
})
export class CategoriesCardComponent {
  // 1. Tu arreglo original de categorías
  categorias: Categoria[] = [
    { titulo: 'Mitos Dolorenses', descripcion: 'Relatos tradicionales del pueblo y el centro histórico.', imagen: 'assets/doloreses.png' },
    { titulo: 'Mitos escolares', descripcion: 'Historias espeluznantes que suceden en los pasillos al caer la noche.', imagen: 'assets/escolares.png' },
    { titulo: 'Mitos escondidos', descripcion: 'Secretos antiguos y pasadizos poco conocidos por la gente.', imagen: 'assets/escondidos.png' },
    { titulo: 'Leyendas Locales', descripcion: 'Sucesos y relatos icónicos transmitidos de generación en generación.', imagen: 'assets/locales.png' },
    { titulo: 'Apariciones Nocturnas', descripcion: 'Encuentros misteriosos con figuras en la penumbra de la noche.', imagen: 'assets/nocturnas.png' },
    { titulo: 'Ánimas y Espíritus', descripcion: 'Manifestaciones del más allá que rondan entre nosotros.', imagen: 'assets/espiritus.png' },
    { titulo: 'Casas Embrujadas', descripcion: 'Edificaciones marcadas por sucesos trágicos y presencias paranormales.', imagen: 'assets/casas.png' },
    { titulo: 'Cuentos del Más Allá', descripcion: 'Narraciones sobre el plano espiritual y lo desconocido.', imagen: 'assets/alla.png' },
    { titulo: 'Brujería y Hechicería', descripcion: 'Historias sobre ritos oscuros, hechizos y supersticiones antiguas.', imagen: 'assets/hechiseria.png' },
    { titulo: 'Leyendas del Panteón', descripcion: 'Secretos y lamentos guardados tras los muros del cementerio.', imagen: 'assets/panteon.png' },
    { titulo: 'Sucesos Inexplicables', descripcion: 'Acontecimientos extraños a los que nadie ha podido dar respuesta.', imagen: 'assets/inexplicables.png' },
    { titulo: 'Historias Rurales y del Campo', descripcion: 'Misterios y presencias acechando en caminos y brechas apartadas.', imagen: 'assets/campo.png' },
    { titulo: 'Tesoros Ocultos y En entierros', descripcion: 'Leyendas de riquezas escondidas y las ánimas que las custodian.', imagen: 'assets/entierros.png' },
    { titulo: 'Pactos y Maldiciones', descripcion: 'Acuerdos oscuros y promesas marcadas por un destino fatal.', imagen: 'assets/pactos.jpg' }
  ];

  // 2. Lo nuevo que necesitas agregar para el filtro y favoritos
  categoriaSeleccionada: string | null = null;

  historias = [
    {
      id: '101',
      titulo: 'La Llorona del Río Laja',
      categoria: 'Leyendas Locales',
      descripcion: 'Dicen que por las madrugadas se escuchan sus lamentos cerca del puente...',
      imagen: 'images/callejon-milagros.jpg'
    },
    {
      id: '102',
      titulo: 'El Conserje del Edificio B',
      categoria: 'Mitos escolares', // OJO: Ajustado con minúscula para que coincida exacto con tu array de arriba
      descripcion: 'Alumnos del turno vespertino aseguran ver luces encendidas cuando el CBTis 75 ya cerró...',
      imagen: 'images/callejon-milagros.jpg'
    },
    {
      id: '103',
      titulo: 'La Sombra del Panteón Municipal',
      categoria: 'Leyendas del Panteón', // Ajustado a una categoría que sí existe en tu lista
      descripcion: 'Una figura alta observa desde la barda a quienes pasan después de medianoche...',
      imagen: 'images/callejon-milagros.jpg'
    }
  ];

  // 3. Inyección del servicio en el constructor
  constructor(private historiasService: HistoriasService) {}

  // 4. Métodos para filtrar y guardar favoritos
  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = this.categoriaSeleccionada === categoria ? null : categoria;
  }

  get historiasFiltradas() {
    if (!this.categoriaSeleccionada) return [];
    return this.historias.filter(h => h.categoria === this.categoriaSeleccionada);
  }

  marcarFavorito(leyenda: any): void {
    this.historiasService.toggleFavorito({
      id: leyenda.id,
      titulo: leyenda.titulo,
      categoria: leyenda.categoria,
      fecha: leyenda.fecha || 'Hoy',
      imagen: leyenda.imagen
    });
  }
}
