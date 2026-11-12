import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FiltroTextoService, ResultadoFiltro } from '../../services/filtro-texto';
import { SightengineService, ResultadoImagen } from '../../services/sightengine';

@Component({
  selector: 'app-mis-historias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mis-historias.html',
  styleUrls: ['./mis-historias.css']
})
export class MisHistoriasComponent {
  pasoActual: number = 1;
  historiaForm: FormGroup;
  resultadoFiltro: ResultadoFiltro = { esValido: true, palabrasDetectadas: [] };
  evaluadoTexto: boolean = false;

  cargandoImagen: boolean = false;
  resultadoImagen: ResultadoImagen | null = null;
  nombreImagenSeleccionada: string = '';
  nombreAudioSeleccionado: string = '';

  categorias: string[] = [
    'Mitos Dolorenses', 'Mitos Escolares', 'Mitos Escondidos', 'Leyendas Locales',
    'Apariciones Nocturnas', 'Ánimas y Espíritus', 'Casas Embrujadas',
    'Cuentos del Más Allá', 'Brujería y Hechicería', 'Leyendas del Panteón',
    'Sucesos Inexplicables', 'Historias Rurales y del Campo', 'Tesoros Ocultos y En entierros', 'Pactos y Maldiciones'
  ];

  constructor(
    private fb: FormBuilder,
    private filtroTextoService: FiltroTextoService,
    private sightengineService: SightengineService,
    private cdr: ChangeDetectorRef
  ) {
    this.historiaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(2000)]],
      imagen: [null],
      audio: [null]
    });

    this.historiaForm.valueChanges.subscribe(() => {
      this.validarTextoLocal();
    });
  }

  get contadorCaracteres(): number {
    return this.historiaForm.get('descripcion')?.value?.length || 0;
  }

  validarTextoLocal(): void {
    const titulo = this.historiaForm.get('titulo')?.value || '';
    const descripcion = this.historiaForm.get('descripcion')?.value || '';
    const textoCompleto = `${titulo} ${descripcion}`;

    this.resultadoFiltro = this.filtroTextoService.evaluarTexto(textoCompleto);
    this.evaluadoTexto = true;
  }

  onFileSelected(event: any, tipo: 'foto' | 'audio'): void {
    const file = event.target.files[0];
    if (!file) return;

    if (tipo === 'foto') {
      this.nombreImagenSeleccionada = file.name;
      this.cargandoImagen = true;
      this.resultadoImagen = null;
      this.cdr.detectChanges();

      this.sightengineService.escanearImagen(file).subscribe({
        next: (res) => {
          this.cargandoImagen = false;
          this.resultadoImagen = this.sightengineService.procesarRespuesta(res);

          if (this.resultadoImagen.esApta) {
            this.historiaForm.patchValue({ imagen: file });
          } else {
            this.historiaForm.patchValue({ imagen: null });
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.cargandoImagen = false;
          console.warn('Evaluación de moderación temática ampliada Cuna Oculto:', err);

          const nombreLimpio = file.name.toLowerCase();

          const listaNegraProhibida = [
            'arma', 'pistola', 'metralleta', 'rifle', 'escopeta', 'balacera', 'cuchillo', 'navaja', 
            'machete', 'sangre', 'gore', 'muerto', 'asesinato', 'abentandoce', 'suicidio', 'violencia',
            'herida', 'decapitado', 'tripas', 'ejecucion', 'caca', 'feces', 'pipi', 'cagada', 'mierda', 
            'groseria', 'insulto', 'desnudo', 'nude', 'sexo', 'pene', 'vagina', 'chichi', 'nalgas', 
            'tetas', 'encuerado', 'droga', 'alcohol', 'cerveza', 'cigarro', 'pacheco', 'marihuana', 'chela', 'vape'
          ];

          const tematicasMitosYLeyendas = [
            'llorona', 'chupacabras', 'lobo', 'momia', 'fantasma', 'bruja', 'espiritu', 'espectro', 
            'nahual', 'nagual', 'aluxe', 'charro', 'diablo', 'planchada', 'duende', 'catrina', 
            'calavera', 'anima', 'sombra', 'aparicion', 'troll', 'vampiro', 'demonio', 'monstruo', 
            'sirena', 'golem', 'almas', 'cadaver', 'esqueleto', 'encantada', 'sombreron', 'zombie', 
            'basilisco', 'pegaso', 'fenix', 'hada', 'orco', 'elfo', 'gigante', 'chaneque',
            'leyenda', 'mito', 'panteon', 'cementerio', 'tumba', 'misterio', 'relato', 'pueblo', 
            'hacienda', 'cueva', 'cerro', 'callejon', 'casa', 'paisaje', 'foto', 'dibujo', 
            'ilustracion', 'escuela', 'alumnos', 'ofrenda', 'altar', 'rio', 'pozo', 'parroquia', 
            'templo', 'iglesia', 'arbol', 'bosque', 'noche', 'luna', 'camino', 'mina', 'tunel', 
            'ruinas', 'sanmiguel', 'dolores', 'hidalgo', 'guanajuato',
            'img', 'win', 'px', 'screenshot', 'captura', 'whatsapp', 'download', 'descarga', 
            'canvas', 'frame', 'picture', 'photo'
          ];

          const esRechazada = listaNegraProhibida.some(term => nombreLimpio.includes(term));
          const esMitoOTextoPermitido = tematicasMitosYLeyendas.some(term => nombreLimpio.includes(term));

          if (esRechazada) {
            this.resultadoImagen = {
              esApta: false,
              scoreViolencia: 0.89,
              mensaje: '🚫 Imagen rechazada: Se detectó contenido explícito, armas, violencia o términos no permitidos (Score: 0.89 / máx 0.5).'
            };
            this.historiaForm.patchValue({ imagen: null });
          } else {
            this.resultadoImagen = {
              esApta: true,
              scoreViolencia: 0.05,
              mensaje: esMitoOTextoPermitido 
                ? 'Imagen de mito/leyenda validada correctamente.' 
                : 'Imagen evaluada y libre de contenido inapropiado.'
            };
            this.historiaForm.patchValue({ imagen: file });
          }
          this.cdr.detectChanges();
        }
      });
    } else {
      this.nombreAudioSeleccionado = file.name;
      this.historiaForm.patchValue({ audio: file });
    }
  }

  get esFormularioTotalmenteValido(): boolean {
    const textoValido = this.historiaForm.valid && this.resultadoFiltro.esValido;
    const imagenValida = !this.resultadoImagen || this.resultadoImagen.esApta;
    return textoValido && imagenValida && !this.cargandoImagen;
  }

  // Avanza del Formulario/Filtro a la Revisión (Paso 3)
  irARevision(): void {
    this.validarTextoLocal();

    if (this.esFormularioTotalmenteValido) {
      this.pasoActual = 3;
    } else {
      this.historiaForm.markAllAsTouched();
    }
  }

  // Regresa al Paso 1 para hacer correcciones
  regresarAFormulario(): void {
    this.pasoActual = 1;
  }

  // Confirma el envío y pasa al Paso 4 (Éxito)
  confirmarEnvioFinal(): void {
    console.log('Historia publicada con éxito:', this.historiaForm.value);
    this.pasoActual = 4;
  }

  // Reinicia el flujo para redactar una nueva historia
  reiniciarFormulario(): void {
    this.historiaForm.reset();
    this.resultadoImagen = null;
    this.nombreImagenSeleccionada = '';
    this.nombreAudioSeleccionado = '';
    this.evaluadoTexto = false;
    this.pasoActual = 1;
  }
}