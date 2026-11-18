import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Leyenda } from '../../models/leyenda.model';
import { LEYENDAS_MOCK } from '../../models/leyendas.mock';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('categoria') || '';
      this.categoriaSeleccionada = cat ? decodeURIComponent(cat).trim() : '';
      this.esMisHistorias = false;
      this.cargarHistorias();
    });
  }

  cargarHistorias(): void {
    if (this.categoriaSeleccionada) {
      const catLimpia = this.categoriaSeleccionada.toLowerCase().trim();
      this.historiasBase = LEYENDAS_MOCK.filter(
        h => h.categoria && h.categoria.toLowerCase().trim() === catLimpia
      );
    } else {
      this.historiasBase = LEYENDAS_MOCK;
    }
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