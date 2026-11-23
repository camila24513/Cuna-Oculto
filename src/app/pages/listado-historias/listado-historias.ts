import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Leyenda } from '../../models/leyenda.model';
import { HistoriasService } from '../../services/historias';

@Component({
  selector: 'app-listado-historias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listado-historias.html',
  styleUrls: ['./listado-historias.css']
})
export class ListadoHistoriasComponent implements OnInit {
  categoriaSeleccionada: string = '';
  textoBusqueda: string = '';
  historiasBase: Leyenda[] = [];
  esMisHistorias: boolean = false;
  estrellas = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private historiasService: HistoriasService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('categoria') || '';
      this.categoriaSeleccionada = cat ? decodeURIComponent(cat).trim() : '';
      this.esMisHistorias = false;
      this.cargarHistorias();
    });
  }

  cargarHistorias(): void {
    const todas = this.historiasService.obtenerTodasLasLeyendas();

    if (this.categoriaSeleccionada) {
      const catLimpia = this.categoriaSeleccionada.toLowerCase().trim();
      this.historiasBase = todas.filter(
        h => h.categoria && h.categoria.toLowerCase().trim() === catLimpia
      );
    } else {
      this.historiasBase = todas;
    }
  }

  calificar(leyenda: Leyenda, puntos: number): void {
    this.historiasService.calificarHistoria(leyenda.titulo, puntos);
    this.cargarHistorias(); // Recarga promedios en pantalla
  }

  obtenerMiVoto(titulo: string): number {
    return this.historiasService.obtenerMiVoto(titulo);
  }

  marcarFavorito(historia: Leyenda): void {
    this.historiasService.toggleFavorito({
      id: Number(historia.id) || Date.now(),
      titulo: historia.titulo,
      categoria: historia.categoria,
      fecha: 'Hoy',
      imagen: historia.imagen
    });
  }

  get leyendasFiltradas(): Leyenda[] {
    if (!this.textoBusqueda.trim()) {
      return this.historiasBase;
    }
    const busqueda = this.textoBusqueda.toLowerCase();
    return this.historiasBase.filter(h =>
      h.titulo.toLowerCase().includes(busqueda) ||
      (h.descripcion && h.descripcion.toLowerCase().includes(busqueda))
    );
  }
}
