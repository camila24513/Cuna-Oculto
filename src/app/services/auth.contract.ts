import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

export abstract class AuthContract {
  abstract readonly usuario$: Observable<Usuario | null>;
  abstract login(email: string, password: string): Promise<void>;
  abstract register(nombre: string, email: string, password: string): Promise<void>;
  abstract loginWithGoogle(): Promise<void>;
  abstract resetPassword(email: string): Promise<void>;
  abstract logout(): Promise<void>;
}