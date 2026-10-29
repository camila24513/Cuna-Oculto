
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Leyenda, LEYENDAS_MOCK } from '../../models/leyenda.model';

// Importación del componente de categorías
import {CategoriesCardComponent} from '../categories/categories-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesCardComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  @ViewChild('videoCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  leyendas: Leyenda[] = LEYENDAS_MOCK;
  leyendaTop1!: Leyenda;
  leyendasSecundarias: Leyenda[] = [];

  mostrarModalVideo = false;
  grabando = false;
  leyendaSeleccionada!: Leyenda;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.leyendaTop1 = this.leyendas.find(
      l => l.rank === 1
    )!;

    this.leyendasSecundarias = this.leyendas.filter(
      l => l.rank > 1
    );
  }

  verDetalle(id: string): void {
    this.router.navigate(['/leyenda', id]);
  }

  abrirGeneradorVideo(leyenda: Leyenda, event: Event): void {
    event.stopPropagation();

    this.leyendaSeleccionada = leyenda;
    this.mostrarModalVideo = true;

    setTimeout(() => {
      if (this.canvasRef) {
        this.dibujarVistaPreviaCanvas(0).catch(error => {
          console.error('Error al dibujar la vista previa:', error);
        });
      }
    }, 100);
  }

  cerrarModal(): void {
    this.mostrarModalVideo = false;
  }

  private async dibujarVistaPreviaCanvas(
    progress = 0
  ): Promise<void> {
    if (!this.canvasRef || !this.leyendaSeleccionada) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.leyendaSeleccionada.imagenUrl;

    await img.decode();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = 1 + progress * 0.15;

    ctx.save();
    ctx.scale(scale, scale);
    ctx.drawImage(
      img,
      0,
      0,
      canvas.width / scale,
      canvas.height / scale
    );
    ctx.restore();

    const gradient = ctx.createLinearGradient(
      0,
      canvas.height * 0.4,
      0,
      canvas.height
    );

    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.9)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';

    ctx.fillText(
      this.leyendaSeleccionada.titulo,
      canvas.width / 2,
      canvas.height - 100
    );

    ctx.fillStyle = '#FFD700';
    ctx.font = '16px sans-serif';

    ctx.fillText(
      this.leyendaSeleccionada.lugar,
      canvas.width / 2,
      canvas.height - 60
    );
  }

  async iniciarGrabacionVideo(): Promise<void> {
    if (!this.canvasRef || this.grabando) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;

    if (typeof MediaRecorder === 'undefined' ||
        typeof canvas.captureStream !== 'function') {
      console.error(
        'Este navegador no admite la grabación del canvas.'
      );
      return;
    }

    const mimeType = 'video/webm';

    if (!MediaRecorder.isTypeSupported(mimeType)) {
      console.error(
        'Este navegador no admite el formato video/webm.'
      );
      return;
    }

    this.grabando = true;

    const durationMs = 4000;
    const stream = canvas.captureStream(30);

    let mediaRecorder: MediaRecorder;

    try {
      mediaRecorder = new MediaRecorder(stream, { mimeType });
    } catch (error) {
      stream.getTracks().forEach(track => track.stop());
      this.grabando = false;
      console.error('No se pudo iniciar el grabador:', error);
      return;
    }

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onerror = event => {
      console.error('Error durante la grabación:', event);
      stream.getTracks().forEach(track => track.stop());
      this.grabando = false;
    };

    mediaRecorder.onstop = () => {
      if (chunks.length > 0) {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `promo-${this.leyendaSeleccionada.id}.webm`;
        a.click();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      stream.getTracks().forEach(track => track.stop());
      this.grabando = false;
      this.cerrarModal();
    };

    try {
      await this.dibujarVistaPreviaCanvas(0);
      mediaRecorder.start();

      const startTime = performance.now();

      const animate = async (currentTime: number) => {
        try {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / durationMs, 1);

          await this.dibujarVistaPreviaCanvas(progress);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        } catch (error) {
          console.error('Error al generar el video:', error);

          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }
      };

      requestAnimationFrame(animate);
    } catch (error) {
      console.error('No se pudo generar la vista previa:', error);

      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      } else {
        stream.getTracks().forEach(track => track.stop());
        this.grabando = false;
      }
    }
  }
}
