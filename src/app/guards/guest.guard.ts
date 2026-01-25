import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';

/**
 * Guard funcional para rutas de invitados (login, registro).
 * Si el usuario ya está autenticado, lo redirige al onboarding.
 * Si no está autenticado, permite el acceso.
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);
  let isAuthenticated = false;
  store.select(selectIsAuthenticated).subscribe(val => isAuthenticated = val).unsubscribe();
  if (isAuthenticated) {
    // Usuario ya autenticado, redirigir a onboarding
    return router.createUrlTree(['/onboarding']);
  }
  // Usuario no autenticado, permitir acceso
  return true;
};
