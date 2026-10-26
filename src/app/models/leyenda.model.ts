// src/app/models/leyenda.model.ts
export interface Leyenda {
  id: string;
  titulo: string;
  lugar: string;
  imagenUrl: string;
  votos: number;
  rank: number;
}

export const LEYENDAS_MOCK: Leyenda[] = [
  {
    id: '1',
    titulo: 'La Casa de los Lamentos',
    lugar: 'Dolores Hidalgo, Gto.',
    imagenUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
    votos: 1240,
    rank: 1
  },
  {
    id: '2',
    titulo: 'El Cura sin Cabeza',
    lugar: 'Atotonilco',
    imagenUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600',
    votos: 980,
    rank: 2
  },
  {
    id: '3',
    titulo: 'El Llorón del Parral',
    lugar: 'Centro Histórico',
    imagenUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4edd16be1?q=80&w=600',
    votos: 850,
    rank: 3
  }
];
