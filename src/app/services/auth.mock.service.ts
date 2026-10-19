import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthContract } from './auth.contract';
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class AuthMockService implements AuthContract {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$: Observable<Usuario | null> = this.usuarioSubject.asObservable();

  async login(email: string, password: string): Promise<void> {
    await this.delay(1000); // Simula tiempo de respuesta
    this.usuarioSubject.next({
      uid: '12345',
      nombre: 'Estudiante Prueba',
      email: email,
      rol: 'alumno'
    });
  }

  async register(nombre: string, email: string, password: string): Promise<void> {
    await this.delay(1000);
    this.usuarioSubject.next({
      uid: '12345',
      nombre: nombre,
      email: email,
      rol: 'alumno'
    });
  }

  async loginWithGoogle(): Promise<void> {
    await this.delay(1000);
    this.usuarioSubject.next({
      uid: '99999',
      nombre: 'Usuario Google',
      email: 'google@cbtis75.edu.mx',
      rol: 'alumno'
    });
  }

  async resetPassword(email: string): Promise<void> {
    await this.delay(1000);
  }

  async logout(): Promise<void> {
    this.usuarioSubject.next(null);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}