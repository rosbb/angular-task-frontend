import { Component } from "@angular/core"
import { type FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { type Router, RouterLink } from "@angular/router"
import type { AuthService } from "../../services/auth.service"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Iniciar Sesión</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              type="email"
              formControlName="email"
              class="form-input"
              placeholder="tu@email.com"
            >
            <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']"
                 class="error-message">
              El email es requerido
            </div>
            <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']"
                 class="error-message">
              Ingresa un email válido
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
            <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']"
                 class="error-message">
              La contraseña es requerida
            </div>
            <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['minlength']"
                 class="error-message">
              La contraseña debe tener al menos 6 caracteres
            </div>
          </div>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>

          <button 
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="btn-primary"
          >
            <span *ngIf="isLoading">Cargando...</span>
            <span *ngIf="!isLoading">Iniciar Sesión</span>
          </button>

          <p class="register-link">
            ¿No tienes cuenta? 
            <a routerLink="/register">Registrarse</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9fafb;
    }
    
    .login-card {
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
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }
    
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    .btn-primary {
      width: 100%;
      background-color: #6366f1;
      color: white;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.15s ease-in-out;
      margin-top: 1rem;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #5855eb;
    }
    
    .btn-primary:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
    
    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .register-link {
      text-align: center;
      margin-top: 1rem;
      color: #6b7280;
      font-size: 0.875rem;
    }
    
    .register-link a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 500;
    }
    
    .register-link a:hover {
      text-decoration: underline;
    }
  `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup
  error = ""
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true
      this.error = ""

      const { email, password } = this.loginForm.value

      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(["/tasks"])
        },
        error: (error) => {
          this.error = error.error?.message || "Error al iniciar sesión"
          this.isLoading = false
        },
      })
    }
  }
}
