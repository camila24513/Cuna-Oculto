import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResultadoImagen {
  esApta: boolean;
  scoreViolencia: number;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class SightengineService {

  private apiUser = '1183768297'; 
  private apiSecret = 'yqT77V5V4J3GzFp6rV4v'; 
  private apiUrl = 'https://api.sightengine.com/1.0/check.json';

  constructor(private http: HttpClient) {}

  escanearImagen(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('media', file);
    formData.append('models', 'nudity-2.0,wad,violence');
    formData.append('api_user', this.apiUser);
    formData.append('api_secret', this.apiSecret);

    return this.http.post(this.apiUrl, formData);
  }

  procesarRespuesta(res: any): ResultadoImagen {
    // Evaluación segura de violencia, armas y desnudez
    const violencia = res.violence?.prob || 0;
    
    // Si detecta arma de fuego o blanca
    const armaFuego = res.weapon?.firearm || res.weapon || 0;
    const armaBlanca = res.weapon?.knife || 0;
    const armas = Math.max(armaFuego, armaBlanca);

    // Desnudez / contenido explícito
    const desnudez = res.nudity?.sexual_activity || res.nudity?.suggestive || 0;

    const maxScore = Math.max(violencia, armas, desnudez);
    const esApta = maxScore < 0.5;

    let motivo = 'Contenido inapropiado detectado.';
    if (armas >= 0.5) motivo = 'Se detectaron armas u objetos peligrosos.';
    else if (violencia >= 0.5) motivo = 'Se detectó violencia gráfica o gore.';
    else if (desnudez >= 0.5) motivo = 'Se detectó contenido explícito.';

    return {
      esApta: esApta,
      scoreViolencia: maxScore,
      mensaje: esApta 
        ? 'Imagen validada correctamente. Libre de contenido inapropiado.' 
        : `${motivo} (Score: ${maxScore.toFixed(2)} / máx 0.5)`
    };
  }
}