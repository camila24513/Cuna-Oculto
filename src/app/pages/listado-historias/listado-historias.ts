import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LEYENDAS_MOCK, Leyenda } from '../../models/leyendas.mock';

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
  leyendas: Leyenda[] = LEYENDAS_MOCK;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['nombre']) {
        this.categoriaSeleccionada = params['nombre'];
      }
    });
  }

  get leyendasFiltradas(): Leyenda[] {
    return this.leyendas.filter(leyenda => {
      const coincideCategoria = this.categoriaSeleccionada 
        ? leyenda.categoria.toLowerCase() === this.categoriaSeleccionada.toLowerCase() 
        : true;
      const coincideTexto = leyenda.titulo.toLowerCase().includes(this.textoBusqueda.toLowerCase()) || 
                             leyenda.resumen.toLowerCase().includes(this.textoBusqueda.toLowerCase());
      return coincideCategoria && coincideTexto;
    });
  }
}