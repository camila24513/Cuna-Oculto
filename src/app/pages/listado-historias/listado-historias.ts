import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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

  // Objeto para almacenar la nueva historia creada por el usuario
  nuevaHistoria: Leyenda = {
    titulo: '',
    descripcion: '',
    categoria: '',
    ubicacion: '',
    imagen: 'assets/fondo.png'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('categoria') || '';
      this.categoriaSeleccionada = cat ? decodeURIComponent(cat).trim() : '';
      
      // Evalúa si estás navegando en la ruta de 'mis-historias' o no hay categoría selecc.
      const urlActual = this.router.url;
      this.esMisHistorias = urlActual.includes('mis-historias') || !this.categoriaSeleccionada;

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

  agregarHistoria(): void {
    if (this.nuevaHistoria.titulo && this.nuevaHistoria.descripcion) {
      // Agregamos la nueva leyenda al listado central
      LEYENDAS_MOCK.unshift({ ...this.nuevaHistoria });
      
      // Recargamos la lista actual
      this.cargarHistorias();

      // Limpiamos el formulario
      this.nuevaHistoria = {
        titulo: '',
        descripcion: '',
        categoria: '',
        ubicacion: '',
        imagen: 'assets/fondo.png'
      };
      
      alert('¡Tu historia ha sido agregada exitosamente!');
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