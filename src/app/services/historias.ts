import { Injectable } from '@angular/core';

export interface HistoriaItem {
  id: number;
  titulo: string;
  categoria: string;
  descripcion?: string;
  ubicacion?: string;
  fecha: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoriasService {
  private readonly KEY_PUBLICADAS = 'cuna_publicadas';
  private readonly KEY_BORRADORES = 'cuna_borradores';
  private readonly KEY_FAVORITOS = 'cuna_favoritos';
  private readonly KEY_FOTO = 'cuna_foto_perfil';

  constructor() {
    this.inicializarDatosPorDefecto();
  }

  private inicializarDatosPorDefecto(): void {
    if (!localStorage.getItem(this.KEY_PUBLICADAS)) {
      const iniciales: HistoriaItem[] = [
        {
          id: 1,
          titulo: 'La Casa de los Lamentos',
          categoria: 'Mitos dolorenses',
          fecha: '12 Nov 2026',
          imagen: 'fondoapp.png'
        }
      ];
      localStorage.setItem(this.KEY_PUBLICADAS, JSON.stringify(iniciales));
    }
  }

  // --- FOTO DE PERFIL ---
  obtenerFotoPerfil(): string {
    return localStorage.getItem(this.KEY_FOTO) || 'imagen/avatar-default.png';
  }

  guardarFotoPerfil(base64: string): void {
    localStorage.setItem(this.KEY_FOTO, base64);
  }

  // --- MIS HISTORIAS PUBLICADAS ---
  obtenerPublicadas(): HistoriaItem[] {
    return JSON.parse(localStorage.getItem(this.KEY_PUBLICADAS) || '[]');
  }

  publicarHistoria(historia: Omit<HistoriaItem, 'id' | 'fecha'>, borradorId?: number): void {
    const lista = this.obtenerPublicadas();
    const nueva: HistoriaItem = {
      ...historia,
      id: Date.now(),
      fecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      imagen: historia.imagen || 'fondoapp.png'
    };
    lista.unshift(nueva); // Agrega al principio
    localStorage.setItem(this.KEY_PUBLICADAS, JSON.stringify(lista));

    // Si venía de un borrador, lo eliminamos de borradores
    if (borradorId) {
      this.eliminarBorrador(borradorId);
    }
  }

  // --- BORRADORES (HISTORIAS SIN TERMINAR) ---
  obtenerBorradores(): HistoriaItem[] {
    return JSON.parse(localStorage.getItem(this.KEY_BORRADORES) || '[]');
  }

  guardarBorrador(borrador: Omit<HistoriaItem, 'id' | 'fecha'>, borradorIdExistente?: number): number {
    let lista = this.obtenerBorradores();
    const fechaActual = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

    if (borradorIdExistente) {
      lista = lista.map(b => b.id === borradorIdExistente ? { ...b, ...borrador, fecha: fechaActual } : b);
      localStorage.setItem(this.KEY_BORRADORES, JSON.stringify(lista));
      return borradorIdExistente;
    } else {
      const nuevoId = Date.now();
      lista.unshift({
        ...borrador,
        id: nuevoId,
        titulo: borrador.titulo || 'Historia sin título (Borrador)',
        categoria: borrador.categoria || 'Sin categoría',
        fecha: fechaActual,
        imagen: borrador.imagen || 'fondoapp.png'
      });
      localStorage.setItem(this.KEY_BORRADORES, JSON.stringify(lista));
      return nuevoId;
    }
  }

  eliminarBorrador(id: number): void {
    const lista = this.obtenerBorradores().filter(b => b.id !== id);
    localStorage.setItem(this.KEY_BORRADORES, JSON.stringify(lista));
  }

  // --- FAVORITOS ---
  obtenerFavoritos(): HistoriaItem[] {
    return JSON.parse(localStorage.getItem(this.KEY_FAVORITOS) || '[]');
  }

  toggleFavorito(historia: HistoriaItem): boolean {
    let lista = this.obtenerFavoritos();
    const existe = lista.some(h => h.id === historia.id);

    if (existe) {
      lista = lista.filter(h => h.id !== historia.id);
      localStorage.setItem(this.KEY_FAVORITOS, JSON.stringify(lista));
      return false; // Se quitó de favoritos
    } else {
      lista.unshift(historia);
      localStorage.setItem(this.KEY_FAVORITOS, JSON.stringify(lista));
      return true; // Se agregó a favoritos
    }
  }
}