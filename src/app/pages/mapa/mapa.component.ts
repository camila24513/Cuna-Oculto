import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class MapaComponent implements AfterViewInit {
  private map!: L.Map;
  private centroDolores: [number, number] = [21.1561, -100.9323];

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Solución para los iconos rotos de Leaflet en Angular
    const iconoPin = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.map = L.map('map').setView(this.centroDolores, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const puntosConUbicacion = [
      {
        titulo: 'Parroquia de Nuestra Señora de los Dolores',
        lat: 21.1574,
        lng: -100.9332,
        desc: 'Atrio parroquial y centro histórico',
        imagen: 'assets/Libertad.png'
      },
      {
        titulo: 'Mausoleo de José Alfredo Jiménez',
        lat: 21.1535,
        lng: -100.9298,
        desc: 'Panteón Municipal',
        imagen: 'assets/mosaicos.png'
      },
      {
        titulo: 'Museo de la Independencia Nacional',
        lat: 21.1568,
        lng: -100.9341,
        desc: 'Antigua cárcel del pueblo',
        imagen: 'assets/Independencia.png'
      },
      {
        titulo: 'CBTis 75',
        lat: 21.1612,
        lng: -100.9380,
        desc: 'Zona arbolada y mitos escolares',
        imagen: 'assets/arbolada.png'
      },
      {
        titulo: 'Escuela Secundaria Técnica No. 4',
        lat: 21.1520,
        lng: -100.9250,
        desc: 'Eco de los uniformes grises',
        imagen: 'assets/grises.png'
      },
      {
        titulo: 'Presa Peñuelitas',
        lat: 21.2100,
        lng: -100.9500,
        desc: 'Espíritu protector de la presa',
        imagen: 'assets/presa.png'
      },
      {
        titulo: 'Comunidad de El Llanito',
        lat: 21.1200,
        lng: -100.9100,
        desc: 'Señor del Llanito y mezquite de los juramentos',
        imagen: 'assets/Llanito.png'
      }
    ];

    puntosConUbicacion.forEach(punto => {
      // Le pasamos { icon: iconoPin } a cada marcador
      const marker = L.marker([punto.lat, punto.lng], { icon: iconoPin }).addTo(this.map);
      
      const contenidoPopup = `
        <div style="text-align: center; max-width: 200px;">
          <img src="${punto.imagen}" alt="${punto.titulo}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" onerror="this.src='assets/fondo-patron.png'" />
          <h4 style="margin: 0 0 5px 0; font-size: 0.95rem; color: #111;">${punto.titulo}</h4>
          <p style="margin: 0; font-size: 0.8rem; color: #555;">${punto.desc}</p>
        </div>
      `;

      marker.bindPopup(contenidoPopup);
    });
  }
}