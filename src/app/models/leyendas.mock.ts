export interface Leyenda {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: 'Mitos Dolorenses' | 'Mitos escolares' | 'Mitos escondidos';
  imagenUrl: string;
  audioUrl?: string;
  latitud: number;
  longitud: number;
  calificacion: number;
}

export const LEYENDAS_MOCK: Leyenda[] = [
  {
    id: '1',
    titulo: 'La Casa de los Lamentos',
    resumen: 'Una historia clásica sobre susurros y sombras en el centro histórico.',
    contenido: 'Cuentan los habitantes que a medianoche se escuchan cadenas arrastrándose...',
    categoria: 'Mitos Dolorenses',
    imagenUrl: 'assets/lamentos.jpg',
    latitud: 21.1561,
    longitud: -100.9308,
    calificacion: 4.8
  },
  {
    id: '2',
    titulo: 'El Conserje del Turno Nocturno',
    resumen: 'Apariciones extrañas en los pasillos de la escuela al terminar las clases.',
    contenido: 'Los alumnos de la noche aseguran ver a un hombre limpiando salones vacíos...',
    categoria: 'Mitos escolares',
    imagenUrl: 'assets/conserje.jpg',
    latitud: 21.1580,
    longitud: -100.9320,
    calificacion: 4.5
  },
  {
    id: '3',
    titulo: 'El Tunel Secreto de la Parroquia',
    resumen: 'Un pasadizo antiguo oculto bajo las calles principales.',
    contenido: 'Existe una entrada oculta que conectaba los antiguos edificios...',
    categoria: 'Mitos escondidos',
    imagenUrl: 'assets/tunel.jpg',
    latitud: 21.1550,
    longitud: -100.9300,
    calificacion: 4.9
  }
];