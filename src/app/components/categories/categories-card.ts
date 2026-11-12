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
    { titulo: 'Mitos Dolorenses', descripcion: 'Relatos tradicionales del pueblo y el centro histórico.', imagen: 'assets/mitos-dolorenses.jpg' },
    { titulo: 'Mitos escolares', descripcion: 'Historias espeluznantes que suceden en los pasillos al caer la noche.', imagen: 'assets/mitos-escolares.jpg' },
    { titulo: 'Mitos escondidos', descripcion: 'Secretos antiguos y pasadizos poco conocidos por la gente.', imagen: 'assets/mitos-escondidos.jpg' },
    { titulo: 'Leyendas Locales', descripcion: 'Sucesos y relatos icónicos transmitidos de generación en generación.', imagen: 'assets/leyendas-locales.jpg' },
    { titulo: 'Apariciones Nocturnas', descripcion: 'Encuentros misteriosos con figuras en la penumbra de la noche.', imagen: 'assets/apariciones-nocturnas.jpg' },
    { titulo: 'Ánimas y Espíritus', descripcion: 'Manifestaciones del más allá que rondan entre nosotros.', imagen: 'assets/animas-espiritus.jpg' },
    { titulo: 'Casas Embrujadas', descripcion: 'Edificaciones marcadas por sucesos trágicos y presencias paranormales.', imagen: 'assets/casas-embrujadas.jpg' },
    { titulo: 'Cuentos del Más Allá', descripcion: 'Narraciones sobre el plano espiritual y lo desconocido.', imagen: 'assets/cuentos-mas-alla.jpg' },
    { titulo: 'Brujería y Hechicería', descripcion: 'Historias sobre ritos oscuros, hechizos y supersticiones antiguas.', imagen: 'assets/brujeria-hechiceria.jpg' },
    { titulo: 'Leyendas del Panteón', descripcion: 'Secretos y lamentos guardados tras los muros del cementerio.', imagen: 'assets/leyendas-panteon.jpg' },
    { titulo: 'Sucesos Inexplicables', descripcion: 'Acontecimientos extraños a los que nadie ha podido dar respuesta.', imagen: 'assets/sucesos-inexplicables.jpg' },
    { titulo: 'Historias Rurales y del Campo', descripcion: 'Misterios y presencias acechando en caminos y brechas apartadas.', imagen: 'assets/historias-rurales.jpg' },
    { titulo: 'Tesoros Ocultos y En entierros', descripcion: 'Leyendas de riquezas escondidas y las ánimas que las custodian.', imagen: 'assets/tesoros-ocultos.jpg' },
    { titulo: 'Pactos y Maldiciones', descripcion: 'Acuerdos oscuros y promesas marcadas por un destino fatal.', imagen: 'assets/pactos-maldiciones.jpg' }
  ];
}