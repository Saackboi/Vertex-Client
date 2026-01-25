import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../core/services/notification.service';

/**
 * Interceptor funcional para:
 * 1. Agregar el token JWT a todas las peticiones a /api
 * 2. Manejar errores 401 (Unauthorized) redirigiendo al login
 * 3. Manejar errores globales del servidor
 * 4. Mostrar notificaciones visuales para errores críticos
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  // Obtener token de localStorage
  const token = localStorage.getItem('authToken');

  // Clonar la petición y agregar el token si existe y es una petición a /api
  let clonedRequest = req;
  if (token && req.url.includes('/api')) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Procesar la petición y manejar errores
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Manejar error de red (status 0 = sin conexión al servidor)
      if (error.status === 0) {
        notificationService.showError(
          'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
        );
        console.warn('🌐 Error de red: No hay conexión con el servidor');
      }
      
      // Manejar error 401 - Token inválido o expirado
      else if (error.status === 401) {
        notificationService.showWarning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        console.warn('🔒 Sesión expirada o token inválido. Redirigiendo al login...');
        
        // Limpiar almacenamiento
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        
        // Redirigir al login
        router.navigate(['/login']);
      }

      // Manejar error 403 - Forbidden
      else if (error.status === 403) {
        notificationService.showError('No tienes permisos para realizar esta acción.');
        console.error('🚫 Acceso denegado');
      }

      // Manejar error 500 - Server Error
      else if (error.status === 500) {
        notificationService.showError(
          'El servidor encontró un error. Estamos trabajando en solucionarlo.'
        );
        console.error('⚠️ Error del servidor:', error.message);
      }

      // Manejar error 503 - Service Unavailable
      else if (error.status === 503) {
        notificationService.showError(
          'El servicio no está disponible temporalmente. Intenta más tarde.'
        );
        console.error('⚠️ Servicio no disponible');
      }

      // Re-lanzar el error para que los componentes puedan manejarlo
      return throwError(() => error);
    })
  );
};
