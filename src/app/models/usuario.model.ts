export type Rol = 'alumno' | 'docente';

export interface Usuario {
  uid: string;
  nombre: string;
  email: string;
  rol: Rol;
}