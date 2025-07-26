import { Injectable } from "@angular/core"
import type { Router, CanActivate } from "@angular/router"
import type { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true
    } else {
      this.router.navigate(["/login"])
      return false
    }
  }
}
