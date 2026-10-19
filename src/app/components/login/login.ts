import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthMockService } from '../../services/auth.mock.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  cargando = false;
  mensajeError: string | null = null;
  mensajeExito: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthMockService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensajeError = null;

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      this.router.navigate(['/home']);
    } catch (error) {
      this.mensajeError = 'Correo o contraseña incorrectos.';
    } finally {
      this.cargando = false;
    }
  }

  async onGoogleLogin() {
    this.cargando = true;
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/home']);
    } catch (error) {
      this.mensajeError = 'Error al iniciar sesión con Google.';
    } finally {
      this.cargando = false;
    }
  }

  async onResetPassword() {
    const email = this.loginForm.get('email')?.value;
    if (!email || this.loginForm.get('email')?.invalid) {
      this.mensajeError = 'Ingresa un correo válido para recuperar tu contraseña.';
      return;
    }

    this.cargando = true;
    try {
      await this.authService.resetPassword(email);
      this.mensajeExito = 'Se ha enviado un correo para restablecer tu contraseña.';
    } catch (error) {
      this.mensajeError = 'No se pudo enviar el correo de recuperación.';
    } finally {
      this.cargando = false;
    }
  }
}
