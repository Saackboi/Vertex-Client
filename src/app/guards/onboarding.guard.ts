import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OnboardingService } from '../services/onboarding.service';

/**
 * Guard para la ruta de onboarding
 * Permite el acceso al onboarding incluso si ya fue completado
 * para que los usuarios puedan revisar y modificar su información
 */
export const onboardingGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const onboardingService = inject(OnboardingService);

  // Permitir acceso al onboarding siempre (cargará el progreso del usuario)
  return of(true);
};
