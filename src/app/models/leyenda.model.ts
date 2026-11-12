export interface Leyenda {
  id?: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  ubicacion?: string;
  // Campos utilizados en HomeComponent
  rank?: number;
  votos?: number;
  lugar?: string;
  imagenUrl?: string;
}

// Re-exportamos los datos MOCK para mantener compatibilidad con HomeComponent
export { LEYENDAS_MOCK } from './leyendas.mock';