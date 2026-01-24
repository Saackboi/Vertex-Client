import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OnboardingService } from '../services/onboarding.service';

/**
 * Guard para la ruta de onboarding
 * Si el usuario ya completó el onboarding, redirige a /dashboard
 * Si no lo ha completado, permite el acceso a /onboarding
 */
export const onboardingGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const onboardingService = inject(OnboardingService);

  // Verificar el estado directamente desde el servicio
  return onboardingService.getResume().pipe(
    map(status => {
      if (status && status.isCompleted) {
        // Ya completó el onboarding, redirigir a dashboard
        return router.createUrlTree(['/dashboard']);
      }
      // No ha completado o no hay datos, permitir acceso al onboarding
      return true;
    }),
    catchError(() => {
      // Si hay error (404, usuario nuevo), permitir acceso al onboarding
      return of(true);
    })
  );
};
