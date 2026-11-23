import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HistoriasService, HistoriaItem } from '../../services/historias';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {
  usuario = {
    nombre: '',
    correo: '',
    rol: 'Narrador Dolorense',
    fotoUrl: 'imagen/avatar-default.png'
  };

  tabActiva: 'mis-historias' | 'favoritos' | 'borradores' = 'mis-historias';

  misHistorias: HistoriaItem[] = [];
  favoritos: HistoriaItem[] = [];
  borradores: HistoriaItem[] = [];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private historiasService: HistoriasService
  ) {}

  ngOnInit(): void {
    this.cargarDatosPerfil();
  }

  cargarDatosPerfil(): void {
    const usuarioGuardado = localStorage.getItem('usuario_activo');

    // no hay sesión iniciada
    if (!usuarioGuardado) {
      this.router.navigate(['/login']);
      return;
    }

    const datos = JSON.parse(usuarioGuardado);
    this.usuario.nombre = datos.nombre;
    this.usuario.correo = datos.correo;
    this.usuario.rol = datos.rol || 'Narrador Dolorense';

    // Carga la foto específica de ESTE correo 
    const fotoPropia = localStorage.getItem('foto_perfil_' + this.usuario.correo);
    this.usuario.fotoUrl = fotoPropia ? fotoPropia : 'imagen/avatar-default.png';

    this.misHistorias = this.historiasService.obtenerPublicadas();
    this.favoritos = this.historiasService.obtenerFavoritos();
    this.borradores = this.historiasService.obtenerBorradores();
  }

  cambiarTab(tab: 'mis-historias' | 'favoritos' | 'borradores'): void {
    this.tabActiva = tab;
  }

  onSeleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const nuevaFoto = e.target?.result as string;
        this.usuario.fotoUrl = nuevaFoto;
        // Guardamos la foto 
        localStorage.setItem('foto_perfil_' + this.usuario.correo, nuevaFoto);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  continuarBorrador(id: number): void {
    this.router.navigate(['/mis-historias'], { queryParams: { borradorId: id } });
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario_activo');
    this.router.navigate(['/login']);
  }
}