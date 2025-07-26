import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Actualizar la URL base de la API
  private apiUrl = "http://localhost:3000/api/auth" // Ajustar según tu estructura de endpoints
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  public currentUser: Observable<any> = this.currentUserSubject.asObservable()

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // Verificar si hay un token guardado al inicializar
    const token = localStorage.getItem("token")
    if (token) {
      // Decodificar el token para obtener info del usuario
      const payload = JSON.parse(atob(token.split(".")[1]))
      this.currentUserSubject.next(payload)
    }
  }

  // Actualizar el método de login para coincidir con tu API
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        // Ajustar según la estructura de respuesta de tu API
        localStorage.setItem("token", response.accessToken || response.token)
        localStorage.setItem("refreshToken", response.refreshToken)
        this.currentUserSubject.next(response.user || response.data)
      }),
    )
  }

  // Actualizar el método de registro
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        localStorage.setItem("token", response.accessToken || response.token)
        localStorage.setItem("refreshToken", response.refreshToken)
        this.currentUserSubject.next(response.user || response.data)
      }),
    )
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    this.currentUserSubject.next(null)
    this.router.navigate(["/login"])
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken")
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false

    // Verificar si el token no ha expirado
    const payload = JSON.parse(atob(token.split(".")[1]))
    const expiry = payload.exp * 1000
    return Date.now() < expiry
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value
  }

  // Actualizar el método de refresh token
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken()
    return this.http.post(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((response: any) => {
        localStorage.setItem("token", response.accessToken || response.token)
      }),
    )
  }
}
