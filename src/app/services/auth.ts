import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendPasswordResetEmail, 
  signOut, 
  authState 
} from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export type Rol = 'alumno' | 'docente';

export interface Usuario {
  uid: string;
  nombre: string;
  email: string;
  rol: Rol;
}

export abstract class AuthContract {
  abstract login(email: string, password: string): Promise<void>;
  abstract register(nombre: string, email: string, password: string): Promise<void>;
  abstract loginWithGoogle(): Promise<void>;
  abstract resetPassword(email: string): Promise<void>;
  abstract logout(): Promise<void>;
  abstract usuario$: Observable<Usuario | null>;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthContract {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  // Mantiene el estado del usuario logueado y lee su rol de Firestore
  usuario$: Observable<Usuario | null> = authState(this.auth).pipe(
    switchMap(user => {
      if (!user) return of(null);
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      return docData(userDocRef) as Observable<Usuario>;
    })
  );

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(nombre: string, email: string, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = credential.user.uid;

    const nuevoUsuario: Usuario = {
      uid,
      nombre,
      email,
      rol: 'alumno' // Por defecto entra como alumno
    };

    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, nuevoUsuario);
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    const user = credential.user;

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const nuevoUsuario: Usuario = {
      uid: user.uid,
      nombre: user.displayName || 'Usuario Google',
      email: user.email || '',
      rol: 'alumno'
    };

    await setDoc(userDocRef, nuevoUsuario, { merge: true });
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}