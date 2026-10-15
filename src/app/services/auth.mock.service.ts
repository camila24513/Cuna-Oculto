import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthContract } from './auth.contract';
import { Usuario } from '../models/usuario.model';

@Injectable()
export class AuthMockService extends AuthContract {
  private readonly _usuario = new BehaviorSubject<Usuario | null>(null);
  readonly usuario$ = this._usuario.asObservable();

  async login(email: string, password: string): Promise<void> {
    this._usuario.next({ uid: '1', nombre: 'Usuario de prueba', email, rol: 'alumno' });
  }
  async register(nombre: string, email: string, password: string): Promise<void> {
    this._usuario.next({ uid: '1', nombre, email, rol: 'alumno' });
  }
  async loginWithGoogle(): Promise<void> {
    this._usuario.next({ uid: '1', nombre: 'Usuario Google', email: 'prueba@gmail.com', rol: 'alumno' });
  }
  async resetPassword(email: string): Promise<void> {}
  async logout(): Promise<void> {
    this._usuario.next(null);
  }
}