import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ApiResponse,
  SaveProgressDto,
  OnboardingStatusDto,
  ProfessionalProfileDto
} from '../models/api.types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private http = inject(HttpClient);

  // URL base del API (desde environment)
  private readonly API_URL = `${environment.apiUrl}/onboarding`;

  /**
   * Guarda el progreso del onboarding
   * POST /api/onboarding/save
   * 
   * IMPORTANTE: El UserId se extrae automáticamente del token JWT en el backend.
   * NO enviar userId en el request body.
   */
  saveProgress(dto: SaveProgressDto): Observable<OnboardingStatusDto> {
    return this.http.post<ApiResponse<OnboardingStatusDto>>(`${this.API_URL}/save`, dto)
      .pipe(
        map(response => this.handleResponse(response, 'Progreso guardado exitosamente')),
        catchError(this.handleError)
      );
  }

  /**
   * Recupera el estado actual del onboarding del usuario autenticado
   * GET /api/onboarding/resume
   * 
   * Retorna null si no hay progreso guardado (usuario nuevo con 404).
   */
  getResume(): Observable<OnboardingStatusDto | null> {
    return this.http.get<ApiResponse<OnboardingStatusDto>>(`${this.API_URL}/resume`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          return null;
        }),
        catchError((error: HttpErrorResponse) => {
          // Si es 404, retornar null (usuario nuevo sin progreso)
          if (error.status === 404) {
            console.log('No hay progreso de onboarding previo, iniciando desde el paso 1');
            return of(null); // Retornar observable con null
          }
          return this.handleError(error);
        })
      );
  }

  /**
   * Completa el proceso de onboarding
   * POST /api/onboarding/complete
   * 
   * Convierte los datos temporales del OnboardingProcess en entidades relacionales
   * (ProfessionalProfile, WorkExperience, Education, ProfileSkill)
   */
  complete(): Observable<ProfessionalProfileDto> {
    return this.http.post<ApiResponse<ProfessionalProfileDto>>(`${this.API_URL}/complete`, {})
      .pipe(
        map(response => this.handleResponse(response, 'Onboarding completado exitosamente')),
        catchError(this.handleError)
      );
  }

  /**
   * Maneja la respuesta exitosa del API
   */
  private handleResponse<T>(response: ApiResponse<T>, successMessage: string): T {
    if (response.success && response.data) {
      console.log(`✅ ${successMessage}`);
      return response.data;
    } else {
      const errorMessage = response.errors.length > 0 
        ? response.errors.join(', ') 
        : response.message;
      throw new Error(errorMessage);
    }
  }

  /**
   * Maneja errores HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.error && typeof error.error === 'object') {
        const apiError = error.error as ApiResponse<any>;
        if (apiError.errors && apiError.errors.length > 0) {
          errorMessage = apiError.errors.join(', ');
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    console.error('OnboardingService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
