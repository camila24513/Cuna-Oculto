import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthMockService } from '../../services/auth.mock.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  cargando = false;
  mensajeError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthMockService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensajeError = null;

    try {
      const { nombre, email, password } = this.registerForm.value;
      await this.authService.register(nombre, email, password);
      this.router.navigate(['/home']);
    } catch (error) {
      this.mensajeError = 'Ocurrió un error al crear la cuenta.';
    } finally {
      this.cargando = false;
    }
  }
}