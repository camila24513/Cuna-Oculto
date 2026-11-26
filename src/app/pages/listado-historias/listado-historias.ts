import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class ListadoHistoriasComponent implements OnInit, OnDestroy {
  categoriaSeleccionada: string = '';
  textoBusqueda: string = '';
  historiasBase: Leyenda[] = [];
  esMisHistorias: boolean = false;
  
  private utterance: SpeechSynthesisUtterance | null = null;
  public historiaReproduciendo: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cat = params.get('categoria') || '';
      this.categoriaSeleccionada = cat ? decodeURIComponent(cat).trim() : '';
      this.esMisHistorias = false;
      this.cargarHistorias();
    });
  }

  ngOnDestroy(): void {
    this.detenerVoz();
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

  // Métodos de control de audio / voz
  reproducirVoz(leyenda: Leyenda): void {
    if (!('speechSynthesis' in window)) return;

    if (window.speechSynthesis.paused && this.historiaReproduciendo === leyenda.titulo) {
      window.speechSynthesis.resume();
      return;
    }

    window.speechSynthesis.cancel();

    this.utterance = new SpeechSynthesisUtterance(`${leyenda.titulo}. ${leyenda.descripcion}`);
    this.utterance.lang = 'es-MX';
    
    this.utterance.onend = () => {
      this.historiaReproduciendo = null;
    };

    this.historiaReproduciendo = leyenda.titulo;
    window.speechSynthesis.speak(this.utterance);
  }

  pausarVoz(): void {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  detenerVoz(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.historiaReproduciendo = null;
    }
  }
}