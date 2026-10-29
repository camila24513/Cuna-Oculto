import { Injectable } from '@angular/core';

export interface ResultadoFiltro {
  esValido: boolean;
  palabrasDetectadas: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FiltroTextoService {

  private listaNegra: string[] = [
    'groseria', 'insulto', 'pendejo', 'pendeja', 
    'pendejos', 'pendejas', 'puto', 'puta', 'putos', 
    'putas', 'puteria', 'mierda', 'mierdas', 'demierda', 
    'cabron', 'cabrona', 'cabrones', 'cabronas', 'verga', 'vergas', 'vergazo', 'vergazos', 'mamon', 'mamona', 
    'mamones', 'mamonas', 'mamar', 'joto', 'jota', 'jotos','jotas', 'joteria', 'estupido', 'estupida', 'estupidos', 
   'estupidas', 'imbecil', 'imbeciles', 'chinga', 'chingar', 'chingada', 'chingado', 'chingadazo', 'chingon', 
   'chingona', 'culo', 'culero', 'culera', 'culeros', 'culeras', 'pito', 'pitos', 'meco', 'mecos', 'huevon', 
   'huevona', 'huevones', 'huevonas', 'huevos', 'carajo', 'carajos', 'cono', 'idiota', 'idiotas', 'tarado', 
   'tarada', 'tarados', 'taradas', 'baboso', 'babosa', 'babosos', 'babosas', 'zonzo', 'zonza', 'zonzos', 
   'zonzas', 'menso', 'mensa', 'mensos', 'mensas', 'inutil', 'inutiles', 'maricon', 'maricones', 
   'mariconada', 'perra', 'perras', 'zorra', 'zorras', 'naco', 'naca', 'nacos', 'nacas', 'maldito', 'maldita',
    'malditos', 'malditas', 'puerco', 'puerca', 'marrano','marrana', 'chingada madre', 'chingadamadre', 'desgraciado', 
    'desgraciada', 'desgraciados', 'desgraciadas', 'malnacido', 'malnacida', 'malnacidos', 'malnacidas', 'hijo de puta',
    'hijodeputa', 'hijos de puta', 'hijosdeputa', 'hijo de perra', 'hijodeperra', 
    'hijo de su chingada madre', 'hijo de su perra madre','chinga tu madre', 'chingatumadre', 'vete a la verga', 
    'vete ala verga', 'vete a la mierda', 'vete ala mierda', 'mamarracho', 'mamarracha', 'bastardo', 'bastarda', 
    'bastardos', 'bastardas', 'engendro', 'escoria', 'soquete', 'soquetas', 'llena de mierda', 'lleno de mierda', 
    'come mierda', 'comemierda', 'cagado', 'cagada', 'cagados', 'cagadas', 'cagon', 'cagona', 'cagones', 
    'cagonas', 'poca monta', 'pocamonta', 'poca madre', 'pocamadre', 'sin madre', 'sinmadre', 'pudrete', 
    'pudranse', 'malparido', 'malparida', 'malparidos', 'malparidas', 'culero de mierda', 'pendejo de mierda', 
    'estupido de mierda', 'perra asquerosa', 'puerco de mierda', 'aborto', 'bazofia', 'lacra', 
    'lacras', 'rastrero', 'rastrera', 'parásito', 'parasito', 'parasitos','chupa pollas', 'chupapollas', 'chupa verga', 'chupaverga', 'chupada de verga', 'mamada de verga', 
    'mameis', 'mamadas', 'mamadotas', 'tragabolas', 'traga verga', 'tragaverga', 'traga sables', 'tragasables', 'lamuevos', 
    'lame huevos', 'lamehuevos', 'lame culos', 'lameculos', 'me la pelas', 'me la pela', 'me la pelan', 'me la mamas', 
    'me la mamase', 'me la chupas', 'chupa bolas', 'chupabolas', 'verga muerta', 'vergaza', 'vergota', 'vergotas', 'pelabolas', 
    'pela verga', 'pelaverga', 'cagadero', 'cagada de perro', 'cagado de mierda', 'zurullo', 'mojon', 'mojones', 'mear', 
    'meados', 'meada', 'pedorro', 'pedorra', 'pedorros', 'pedorras', 'pedo de mierda', 'concha de tu madre', 'conchatumadre', 
    'maldita sea', 'coger', 'cogida', 'cogido', 'cogidota', 'encuerado', 'encuerada', 'puchas', 'panocha', 'panochas', 'panochon', 
    'chichi', 'chichis', 'chichotas', 'tetas', 'tetotas', 'tetona', 'tetonas', 'culo abierto', 'culote', 'culotes', 'culera de mierda', 'sexo', 'sexual', 'sexualidad', 'sexualidades', 'orgasmo', 'orgasmos', 'masturbacion', 'masturbaciones', 'masturbarse',
  ];

  private normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/0/g, 'o')
      .replace(/1/g, 'i')
      .replace(/3/g, 'e')
      .replace(/4/g, 'a')
      .replace(/5/g, 's')
      .replace(/7/g, 't')
      .replace(/@/g, 'a')
      .replace(/\$/g, 's');
  }

  evaluarTexto(texto: string): ResultadoFiltro {
    if (!texto || texto.trim().length === 0) {
      return { esValido: true, palabrasDetectadas: [] };
    }

    const textoLimpio = this.normalizarTexto(texto);
    const detectadas: string[] = [];

    for (const palabra of this.listaNegra) {
      const patron = new RegExp(`\\b${palabra.split('').join('+')}\\b`, 'i');
      if (patron.test(textoLimpio)) {
        detectadas.push(palabra);
      }
    }

    return {
      esValido: detectadas.length === 0,
      palabrasDetectadas: detectadas
    };
  }
}