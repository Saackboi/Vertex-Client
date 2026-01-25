import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/error-messages.constants';
import { ApiResponse } from '../../models';

/**
 * Servicio centralizado para el manejo de errores HTTP
 * Proporciona métodos para extraer mensajes de error claros y específicos
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  /**
   * Extrae un mensaje de error legible desde un HttpErrorResponse
   */
  extractErrorMessage(error: unknown): string {
    // Error no es HttpErrorResponse
    if (!(error instanceof HttpErrorResponse)) {
      if (error instanceof Error) {
        return error.message || ERROR_MESSAGES.GENERIC.UNKNOWN;
      }
      return ERROR_MESSAGES.GENERIC.UNKNOWN;
    }

    // Error de red (status 0 = sin conexión)
    if (error.status === 0) {
      return ERROR_MESSAGES.NETWORK.NO_CONNECTION;
    }

    // Intentar extraer mensaje del ApiResponse del backend
    const apiError = this.extractApiResponseError(error);
    if (apiError) {
      return apiError;
    }

    // Mensajes por código de estado HTTP
    return this.getMessageByStatusCode(error.status, error);
  }

  /**
   * Extrae errores desde un ApiResponse<T> del backend
   */
  private extractApiResponseError(error: HttpErrorResponse): string | null {
    if (!error.error || typeof error.error !== 'object') {
      return null;
    }

    const apiResponse = error.error as ApiResponse<any>;

    // Prioridad 1: Array de errores específicos
    if (Array.isArray(apiResponse.errors) && apiResponse.errors.length > 0) {
      return apiResponse.errors.join('. ');
    }

    // Prioridad 2: Mensaje general del response
    if (apiResponse.message && typeof apiResponse.message === 'string') {
      // Detectar errores técnicos de SQL/infraestructura y convertirlos a mensajes amigables
      const message = apiResponse.message;
      
      // Detectar errores de SQL Server
      if (message.includes('SQL Server') || 
          message.includes('Named Pipes Provider') || 
          message.includes('Could not open a connection') ||
          message.includes('connection to SQL')) {
        return ERROR_MESSAGES.SERVER.DATABASE_CONNECTION;
      }
      
      // Detectar errores de Entity Framework / DbContext
      if (message.includes('DbContext') || 
          message.includes('database operation') ||
          message.includes('EntityFramework')) {
        return ERROR_MESSAGES.SERVER.DATABASE_ERROR;
      }
      
      // Si no es un error técnico, devolver el mensaje original
      return message;
    }

    return null;
  }

  /**
   * Obtiene un mensaje de error basado en el código de estado HTTP
   */
  private getMessageByStatusCode(status: number, error: HttpErrorResponse): string {
    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return this.extractValidationError(error) || ERROR_MESSAGES.VALIDATION.INVALID_DATA;

      case HTTP_STATUS.UNAUTHORIZED:
        return ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;

      case HTTP_STATUS.FORBIDDEN:
        return ERROR_MESSAGES.AUTH.UNAUTHORIZED;

      case HTTP_STATUS.NOT_FOUND:
        return ERROR_MESSAGES.NOT_FOUND.RESOURCE;

      case HTTP_STATUS.CONFLICT:
        return ERROR_MESSAGES.CONFLICT.USER_EXISTS;

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return ERROR_MESSAGES.SERVER.INTERNAL_ERROR;

      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return ERROR_MESSAGES.SERVER.SERVICE_UNAVAILABLE;

      default:
        return `${ERROR_MESSAGES.GENERIC.UNKNOWN} (Código: ${status})`;
    }
  }

  /**
   * Intenta extraer detalles de errores de validación (400)
   */
  private extractValidationError(error: HttpErrorResponse): string | null {
    if (error.error?.errors && typeof error.error.errors === 'object') {
      // Si errors es un objeto con campos específicos: { email: ['...'], password: ['...'] }
      const validationErrors: string[] = [];
      for (const field in error.error.errors) {
        if (Array.isArray(error.error.errors[field])) {
          validationErrors.push(...error.error.errors[field]);
        }
      }
      if (validationErrors.length > 0) {
        return validationErrors.join('. ');
      }
    }
    return null;
  }

  /**
   * Maneja un error HTTP y retorna un Observable con el error formateado
   * Uso: .pipe(catchError(err => this.errorHandler.handleError(err)))
   */
  handleError(error: unknown): Observable<never> {
    const message = this.extractErrorMessage(error);
    console.error('Error capturado:', message, error);
    return throwError(() => new Error(message));
  }

  /**
   * Versión simplificada para usar en Effects
   * Retorna directamente el mensaje de error
   */
  getErrorMessage(error: unknown): string {
    return this.extractErrorMessage(error);
  }
}
