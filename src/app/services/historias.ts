import { Injectable } from '@angular/core';
import { Leyenda, LEYENDAS_MOCK } from '../models/leyenda.model';

export interface HistoriaItem {
  id: number;
  titulo: string;
  categoria: string;
  descripcion?: string;
  ubicacion?: string;
  fecha: string;
  imagen: string;
  autor?: string;
  calificacionPromedio?: number;
  totalVotos?: number;
}

interface CalificacionRecord {
  suma: number;
  votos: number;
  miVoto: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoriasService {
  private readonly KEY_PUBLICADAS = 'cuna_publicadas';
  private readonly KEY_BORRADORES = 'cuna_borradores';
  private readonly KEY_FAVORITOS = 'cuna_favoritos';
  private readonly KEY_FOTO = 'cuna_foto_perfil';
  private readonly KEY_CALIFICACIONES = 'cuna_calificaciones';

  constructor() {
    this.inicializarDatosPorDefecto();
  }

  private inicializarDatosPorDefecto(): void {
    if (!localStorage.getItem(this.KEY_PUBLICADAS)) {
      const iniciales: HistoriaItem[] = [
        {
          id: 1,
          titulo: 'La Casa de los Lamentos',
          categoria: 'Mitos Dolorenses',
          descripcion: 'Antigua casona donde por las madrugadas se escuchan lamentos que provienen del patio central.',
          ubicacion: 'Centro Histórico, Dolores Hidalgo',
          fecha: '12 Nov 2026',
          imagen: 'fondoapp.png',
          autor: 'Cronista Dolorense'
        }
      ];
      localStorage.setItem(this.KEY_PUBLICADAS, JSON.stringify(iniciales));
    }
  }

  // --- OBTENER TODAS LAS HISTORIAS (MOCK + PUBLICADAS POR USUARIOS) ---
  obtenerTodasLasLeyendas(): Leyenda[] {
    const publicadas = this.obtenerPublicadas();

    const publicadasComoLeyenda: Leyenda[] = publicadas.map(p => ({
      id: String(p.id),
      titulo: p.titulo,
      descripcion: p.descripcion || 'Relato compartido por la comunidad.',
      imagen: p.imagen,
      categoria: p.categoria,
      ubicacion: p.ubicacion,
      autor: p.autor || 'Narrador Dolorense'
    }));

    const mocksConAutor: Leyenda[] = LEYENDAS_MOCK.map((m, index) => ({
      ...m,
      id: m.id || `mock-${index + 1}`,
      autor: m.autor || (index % 2 === 0 ? 'Cronista Dolorense' : 'Archivo Histórico')
    }));

    const todas = [...publicadasComoLeyenda, ...mocksConAutor];

    return todas.map(h => {
      const stats = this.obtenerStatsCalificacion(h.titulo);
      return {
        ...h,
        calificacionPromedio: stats.promedio,
        totalVotos: stats.votos
      };
    });
  }

  obtenerHistoriasPorAutor(nombreAutor: string): Leyenda[] {
    const autorLimpio = nombreAutor.toLowerCase().trim();
    return this.obtenerTodasLasLeyendas().filter(
      h => (h.autor || '').toLowerCase().trim() === autorLimpio
    );
  }

  // --- SISTEMA DE CALIFICACIONES ---
  private obtenerMapaCalificaciones(): Record<string, CalificacionRecord> {
    return JSON.parse(localStorage.getItem(this.KEY_CALIFICACIONES) || '{}');
  }

  calificarHistoria(tituloHistoria: string, estrellas: number): void {
    const mapa = this.obtenerMapaCalificaciones();
    const registro = mapa[tituloHistoria] || { suma: 0, votos: 0, miVoto: 0 };

    if (registro.miVoto > 0) {
      // Si el usuario ya había votado esta historia, actualiza su voto anterior
      registro.suma = registro.suma - registro.miVoto + estrellas;
    } else {
      registro.suma += estrellas;
      registro.votos += 1;
    }
    registro.miVoto = estrellas;

    mapa[tituloHistoria] = registro;
    localStorage.setItem(this.KEY_CALIFICACIONES, JSON.stringify(mapa));
  }

  obtenerMiVoto(tituloHistoria: string): number {
    const mapa = this.obtenerMapaCalificaciones();
    return mapa[tituloHistoria]?.miVoto || 0;
  }

  obtenerStatsCalificacion(tituloHistoria: string): { promedio: number; votos: number } {
    const mapa = this.obtenerMapaCalificaciones();
    const reg = mapa[tituloHistoria];
    if (!reg || reg.votos === 0) {
      return { promedio: 0, votos: 0 };
    }
    return {
      promedio: Number((reg.suma / reg.votos).toFixed(1)),
      votos: reg.votos
    };
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
    const usuarioActivo = JSON.parse(localStorage.getItem('usuario_activo') || 'null');
    const nombreAutor = historia.autor || usuarioActivo?.nombre || 'Narrador Dolorense';

    const nueva: HistoriaItem = {
      ...historia,
      autor: nombreAutor,
      id: Date.now(),
      fecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      imagen: historia.imagen || 'fondoapp.png'
    };
    lista.unshift(nueva);
    localStorage.setItem(this.KEY_PUBLICADAS, JSON.stringify(lista));

    if (borradorId) {
      this.eliminarBorrador(borradorId);
    }
  }

  // --- BORRADORES ---
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
    const existe = lista.some(h => h.titulo === historia.titulo);

    if (existe) {
      lista = lista.filter(h => h.titulo !== historia.titulo);
      localStorage.setItem(this.KEY_FAVORITOS, JSON.stringify(lista));
      return false;
    } else {
      lista.unshift(historia);
      localStorage.setItem(this.KEY_FAVORITOS, JSON.stringify(lista));
      return true;
    }
  }
}
