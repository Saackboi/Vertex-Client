import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

/**
 * Guard funcional para proteger rutas que requieren autenticación.
 * Verifica la presencia de un token en localStorage.
 * Si no hay token, redirige a /login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (token) {
    return true;
  }

  // Redirigir a login si no hay token
  return router.createUrlTree(['/login']);
};
