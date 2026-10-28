import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Leyenda, LEYENDAS_MOCK } from '../../models/leyenda.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  @ViewChild('videoCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  leyendas: Leyenda[] = LEYENDAS_MOCK;
  leyendaTop1!: Leyenda;
  leyendasSecundarias: Leyenda[] = [];

  mostrarModalVideo = false;
  grabando = false;
  leyendaSeleccionada!: Leyenda;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.leyendaTop1 = this.leyendas.find(l => l.rank === 1)!;
    this.leyendasSecundarias = this.leyendas.filter(l => l.rank > 1);
  }

  verDetalle(id: string): void {
    this.router.navigate(['/leyenda', id]);
  }

  abrirGeneradorVideo(leyenda: Leyenda, event: Event): void {
    event.stopPropagation();
    this.leyendaSeleccionada = leyenda;
    this.mostrarModalVideo = true;
    setTimeout(() => this.dibujarVistaPreviaCanvas(0), 100);
  }

  cerrarModal(): void {
    this.mostrarModalVideo = false;
  }

  private async dibujarVistaPreviaCanvas(progress = 0): Promise<void> {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.leyendaSeleccionada.imagenUrl;
    await img.decode();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Zoom sutil
    const scale = 1 + progress * 0.15;
    ctx.save();
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, canvas.width / scale, canvas.height / scale);
    ctx.restore();

    // Fondo degradado para texto
    const gradient = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Textos
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.leyendaSeleccionada.titulo, canvas.width / 2, canvas.height - 100);

    ctx.fillStyle = '#FFD700';
    ctx.font = '16px sans-serif';
    ctx.fillText(this.leyendaSeleccionada.lugar, canvas.width / 2, canvas.height - 60);
  }

  async iniciarGrabacionVideo(): Promise<void> {
    this.grabando = true;
    const canvas = this.canvasRef.nativeElement;
    const durationMs = 4000;
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `promo-${this.leyendaSeleccionada.id}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      this.grabando = false;
      this.cerrarModal();
    };

    mediaRecorder.start();

    const startTime = performance.now();
    const animate = async (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      await this.dibujarVistaPreviaCanvas(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        mediaRecorder.stop();
      }
    };

    requestAnimationFrame(animate);
  }
}
