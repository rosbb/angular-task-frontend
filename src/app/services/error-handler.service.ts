import { Injectable } from "@angular/core"
import type { HttpErrorResponse } from "@angular/common/http"
import { throwError } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse) {
    let errorMessage = "Ha ocurrido un error inesperado"

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || "Datos inválidos"
          break
        case 401:
          errorMessage = "No autorizado. Por favor, inicia sesión nuevamente"
          break
        case 403:
          errorMessage = "No tienes permisos para realizar esta acción"
          break
        case 404:
          errorMessage = "Recurso no encontrado"
          break
        case 409:
          errorMessage = error.error?.message || "Conflicto con los datos existentes"
          break
        case 422:
          errorMessage = error.error?.message || "Datos de entrada inválidos"
          break
        case 500:
          errorMessage = "Error interno del servidor"
          break
        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`
      }
    }

    console.error("Error completo:", error)
    return throwError(() => new Error(errorMessage))
  }

  // Método para mostrar notificaciones de error (puedes integrarlo con una librería de toast)
  showError(message: string) {
    // Por ahora usamos alert, pero puedes cambiarlo por una librería de notificaciones
    alert(`Error: ${message}`)
  }

  // Método para mostrar notificaciones de éxito
  showSuccess(message: string) {
    alert(`Éxito: ${message}`)
  }
}
