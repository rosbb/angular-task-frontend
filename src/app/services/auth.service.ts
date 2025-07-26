import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Router } from "@angular/router"
import { BehaviorSubject, type Observable } from "rxjs"
import { tap } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:3000/api/auth"
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  public currentUser: Observable<any> = this.currentUserSubject.asObservable()

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        this.currentUserSubject.next(payload)
      } catch (error) {
        console.error("Error parsing token:", error)
        localStorage.removeItem("token")
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        this.loginSuccess(response)
      }),
    )
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        this.loginSuccess(response)
      }),
    )
  }

  // Método centralizado para manejar login exitoso
  loginSuccess(response: any): void {
    const token = response.accessToken || response.token
    const refreshToken = response.refreshToken
    const user = response.user || response.data

    // Guardar en localStorage
    localStorage.setItem("token", token)
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken)
    }
    localStorage.setItem("user", JSON.stringify(user))

    // Actualizar el subject
    this.currentUserSubject.next(user)
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
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

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const expiry = payload.exp * 1000
      return Date.now() < expiry
    } catch (error) {
      console.error("Error parsing token:", error)
      return false
    }
  }

  getCurrentUser(): any {
    const user = localStorage.getItem("user")
    if (user) {
      try {
        return JSON.parse(user)
      } catch (error) {
        console.error("Error parsing user data:", error)
        return null
      }
    }
    return this.currentUserSubject.value
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken()
    return this.http.post(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((response: any) => {
        const newToken = response.accessToken || response.token
        localStorage.setItem("token", newToken)
      }),
    )
  }
}
