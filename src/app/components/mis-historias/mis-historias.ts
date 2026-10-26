import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  categorias: string[] = [
    'Mitos Dolorenses',
    'Mitos Escolares',
    'Mitos Escondidos',
    'Leyendas Locales'
  ];

  constructor(private fb: FormBuilder) {
    this.historiaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(2000)]],
      imagen: [null],
      audio: [null]
    });
  }

  get contadorCaracteres(): number {
    return this.historiaForm.get('descripcion')?.value?.length || 0;
  }

  onFileSelected(event: any, tipo: 'foto' | 'audio'): void {
    const file = event.target.files[0];
    if (file) {
      if (tipo === 'foto') {
        this.historiaForm.patchValue({ imagen: file });
      } else {
        this.historiaForm.patchValue({ audio: file });
      }
    }
  }

  enviarHistoria(): void {
    if (this.historiaForm.valid) {
      console.log('Formulario listo:', this.historiaForm.value);
      
      this.pasoActual = 2;
    } else {
      this.historiaForm.markAllAsTouched();
    }
  }
}