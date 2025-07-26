import { Component, type OnInit } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { CommonModule } from "@angular/common"
import type { AuthService } from "./services/auth.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-lg" *ngIf="authService.isAuthenticated()">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-gray-900">Task Manager</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">¡Hola, {{currentUser?.name || 'Usuario'}}!</span>
              <button 
                (click)="logout()"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main class="container mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
    .container {
      max-width: 1200px;
    }
    
    nav {
      position: sticky;
      top: 0;
      z-index: 50;
    }
    
    button:hover {
      transform: translateY(-1px);
      transition: all 0.2s ease-in-out;
    }
  `,
  ],
})
export class AppComponent implements OnInit {
  currentUser: any = null

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser()

    // Suscribirse a cambios en el usuario actual
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user
    })
  }

  logout() {
    this.authService.logout()
  }
}
