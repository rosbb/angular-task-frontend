import { Component, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-register",
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
              placeholder="Tu nombre completo"
              [attr.aria-invalid]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
            >
            <div *ngIf="registerForm.get('name')?.touched && registerForm.get('name')?.errors?.['required']"
                 class="error-message">
              El nombre es requerido
            </div>
            <div *ngIf="registerForm.get('name')?.touched && registerForm.get('name')?.errors?.['minlength']"
                 class="error-message">
              El nombre debe tener al menos 2 caracteres
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
              [attr.aria-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            >
            <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['required']"
                 class="error-message">
              El email es requerido
            </div>
            <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['email']"
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
              placeholder="Mínimo 6 caracteres"
              [attr.aria-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            >
            <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['required']"
                 class="error-message">
              La contraseña es requerida
            </div>
            <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['minlength']"
                 class="error-message">
              La contraseña debe tener al menos 6 caracteres
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <input 
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              class="form-input"
              placeholder="Repite tu contraseña"
              [attr.aria-invalid]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
            >
            <div *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.errors?.['passwordMismatch']"
                 class="error-message">
              Las contraseñas no coinciden
            </div>
          </div>

          <div *ngIf="error" class="error-message" role="alert">
            {{ error }}
          </div>

          <button 
            type="submit"
            [disabled]="registerForm.invalid || isLoading"
            class="btn-primary"
            [attr.aria-busy]="isLoading"
          >
            <span *ngIf="isLoading" aria-live="polite">Registrando...</span>
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
  styles: [
    `
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
    
    .form-input[aria-invalid="true"] {
      border-color: #ef4444;
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
    
    .login-link {
      text-align: center;
      margin-top: 1rem;
      color: #6b7280;
      font-size: 0.875rem;
    }
    
    .login-link a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 500;
    }
    
    .login-link a:hover {
      text-decoration: underline;
    }
  `,
  ],
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  error = "";
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        name: new FormControl("", [Validators.required, Validators.minLength(2)]),
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl("", [Validators.required]),
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
  if (this.registerForm.valid) {
    this.isLoading = true;
    this.error = "";
    
    const { name, email, password } = this.registerForm.value;
    
    // Enviar 'username' en lugar de 'name' al backend
    this.authService
      .register({ username: name, email, password })  // ← Cambio aquí
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.authService.loginSuccess(response);
          this.router.navigate(["/tasks"]);
        },
        error: (error) => {
          console.error("Register error:", error);
          if (error.status === 409) {
            this.error = "El email ya está registrado";
          } else if (error.status === 0) {
            this.error = "No hay conexión con el servidor";
          } else if (error.error?.errors) {
            this.error = Object.values(error.error.errors).join(", ");
          } else {
            this.error = error.error?.message || "Error al registrarse";
          }
          this.isLoading = false;
        },
      });
  }
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
