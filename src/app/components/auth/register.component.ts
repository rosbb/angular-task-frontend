import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Registrarse</h2>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input 
              id="name" 
              type="text" 
              formControlName="name"
              class="form-input"
              placeholder="Tu nombre"
            >
            <div *ngIf="registerForm.get('name')?.touched && registerForm.get('name')?.errors?.['required']" 
                 class="error-message">
              El nombre es requerido
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              class="form-input"
              placeholder="tu@email.com"
            >
            <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['required']" 
                 class="error-message">
              El email es requerido
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              class="form-input"
              placeholder="Contraseña"
            >
            <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['required']" 
                 class="error-message">
              La contraseña es requerida
            </div>
          </div>

          <div class="form-group">
            <label for="role">Rol</label>
            <select 
              id="role" 
              formControlName="role"
              class="form-input"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>

          <button 
            type="submit" 
            [disabled]="registerForm.invalid || isLoading"
            class="btn-primary"
          >
            <span *ngIf="isLoading">Registrando...</span>
            <span *ngIf="!isLoading">Registrarse</span>
          </button>

          <p class="login-link">
            ¿Ya tienes cuenta? 
            <a routerLink="/login">Iniciar Sesión</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9fafb;
    }
    
    .register-card {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #1f2937;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }
    
    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .login-link {
      text-align: center;
      margin-top: 1rem;
      color: #6b7280;
    }
    
    .login-link a {
      color: #6366f1;
      text-decoration: none;
    }
    
    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  error = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.error = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = error.error?.message || 'Error al registrarse';
          this.isLoading = false;
        }
      });
    }
  }
}