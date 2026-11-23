export interface Leyenda {
  id?: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  ubicacion?: string;
  autor?: string;
  calificacionPromedio?: number;
  totalVotos?: number;
  // Campos utilizados en HomeComponent
  rank?: number;
  votos?: number;
  lugar?: string;
  imagenUrl?: string;
}

export { LEYENDAS_MOCK } from './leyendas.mock';
