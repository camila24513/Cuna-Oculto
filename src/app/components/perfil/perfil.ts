import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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

  esPerfilAjeno: boolean = false;
  tabActiva: 'mis-historias' | 'favoritos' | 'borradores' = 'mis-historias';

  misHistorias: HistoriaItem[] = [];
  favoritos: HistoriaItem[] = [];
  borradores: HistoriaItem[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private historiasService: HistoriasService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const autorParam = params.get('nombre');
      if (autorParam) {
        this.cargarPerfilAjeno(decodeURIComponent(autorParam));
      } else {
        this.cargarDatosPerfilPropio();
      }
    });
  }

  cargarPerfilAjeno(nombreAutor: string): void {
    this.esPerfilAjeno = true;
    this.tabActiva = 'mis-historias';
    this.usuario = {
      nombre: nombreAutor,
      correo: 'Miembro de la comunidad Cuna Oculto',
      rol: 'Narrador de Leyendas',
      fotoUrl: 'imagen/avatar-default.png'
    };

    const historiasAutor = this.historiasService.obtenerHistoriasPorAutor(nombreAutor);
    this.misHistorias = historiasAutor.map((h, i) => ({
      id: Number(h.id) || i,
      titulo: h.titulo,
      categoria: h.categoria,
      descripcion: h.descripcion,
      fecha: `⭐ ${h.calificacionPromedio || 0} (${h.totalVotos || 0} votos)`,
      imagen: h.imagen
    }));

    this.favoritos = [];
    this.borradores = [];
  }

  cargarDatosPerfilPropio(): void {
    this.esPerfilAjeno = false;
    const usuarioGuardado = localStorage.getItem('usuario_activo');

    if (usuarioGuardado) {
      const datos = JSON.parse(usuarioGuardado);
      this.usuario.nombre = datos.nombre || 'Narrador Dolorense';
      this.usuario.correo = datos.correo || datos.email || 'narrador@cunaoculto.mx';
      this.usuario.rol = datos.rol || 'Narrador Dolorense';
    } else {
      // Fallback para que siempre cargue el perfil aunque no hayas pasado por /login
      this.usuario.nombre = 'Narrador Dolorense';
      this.usuario.correo = 'invitado@cunaoculto.mx';
      this.usuario.rol = 'Narrador Dolorense';
    }

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
    if (this.esPerfilAjeno) return;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const nuevaFoto = e.target?.result as string;
        this.usuario.fotoUrl = nuevaFoto;
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
