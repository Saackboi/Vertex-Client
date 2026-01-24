import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor funcional para:
 * 1. Agregar el token JWT a todas las peticiones a /api
 * 2. Manejar errores 401 (Unauthorized) redirigiendo al login
 * 3. Manejar errores globales del servidor
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

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
      // Manejar error 401 - Token inválido o expirado
      if (error.status === 401) {
        console.warn('🔒 Sesión expirada o token inválido. Redirigiendo al login...');
        
        // Limpiar almacenamiento
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        
        // Redirigir al login
        router.navigate(['/login']);
      }

      // Manejar error 403 - Forbidden
      if (error.status === 403) {
        console.error('🚫 Acceso denegado');
      }

      // Manejar error 500 - Server Error
      if (error.status === 500) {
        console.error('⚠️ Error del servidor:', error.message);
      }

      // Re-lanzar el error para que los componentes puedan manejarlo
      return throwError(() => error);
    })
  );
};
