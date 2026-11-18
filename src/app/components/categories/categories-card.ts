import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
}