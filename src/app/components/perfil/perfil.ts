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
    nombre: 'Giselle',
    correo: 'giselle@cunaoculto.mx',
    rol: 'Narradora Dolorense',
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
    // 1. Leemos el usuario que inició sesión o se registró
    const usuarioGuardado = localStorage.getItem('usuario_activo');
    if (usuarioGuardado) {
      const datos = JSON.parse(usuarioGuardado);
      this.usuario.nombre = datos.nombre || 'Usuario';
      this.usuario.correo = datos.correo || 'usuario@cunaoculto.mx';
      this.usuario.rol = datos.rol || 'Narrador Dolorense';
    }

    // 2. Cargamos su foto y sus historias
    this.usuario.fotoUrl = this.historiasService.obtenerFotoPerfil();
    this.misHistorias = this.historiasService.obtenerPublicadas();
    this.favoritos = this.historiasService.obtenerFavoritos();
    this.borradores = this.historiasService.obtenerBorradores();
  }

  cambiarTab(tab: 'mis-historias' | 'favoritos' | 'borradores'): void {
    this.tabActiva = tab;
  }

  // Actualiza la foto al instante y la guarda en localStorage
  onSeleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const nuevaFoto = e.target?.result as string;
        this.usuario.fotoUrl = nuevaFoto;
        this.historiasService.guardarFotoPerfil(nuevaFoto);
        this.cdr.detectChanges(); // <--- Fuerza actualización visual inmediata
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