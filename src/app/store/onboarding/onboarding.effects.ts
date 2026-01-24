import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { OnboardingService } from '../../services/onboarding.service';
import * as OnboardingActions from './onboarding.actions';

@Injectable()
export class OnboardingEffects {
  private actions$ = inject(Actions);
  private onboardingService = inject(OnboardingService);
  private router = inject(Router);

  loadResume$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.loadResume),
      exhaustMap(() =>
        this.onboardingService.getResume().pipe(
          map((data) => {
            if (data) {
              return OnboardingActions.loadResumeSuccess({ data });
            }
            return OnboardingActions.loadResumeFailure({ 
              error: 'No hay progreso de onboarding previo' 
            });
          }),
          catchError((error) =>
            of(OnboardingActions.loadResumeFailure({ 
              error: error.message || 'Error al cargar el progreso' 
            }))
          )
        )
      )
    )
  );

  saveProgress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.saveProgress),
      exhaustMap(({ dto }) =>
        this.onboardingService.saveProgress(dto).pipe(
          map((data) => OnboardingActions.saveProgressSuccess({ data })),
          catchError((error) =>
            of(OnboardingActions.saveProgressFailure({ 
              error: error.message || 'Error al guardar el progreso' 
            }))
          )
        )
      )
    )
  );

  saveProgressSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OnboardingActions.saveProgressSuccess),
        tap(({ data }) => {
          // Si el step cambió, actualizar en el store
          if (data && data.currentStep !== undefined) {
            // La acción updateCurrentStep se despachará desde el componente
          }
        })
      ),
    { dispatch: false }
  );

  completeOnboarding$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.completeOnboarding),
      exhaustMap(() =>
        this.onboardingService.complete().pipe(
          map((profile) => OnboardingActions.completeOnboardingSuccess({ profile })),
          catchError((error) =>
            of(OnboardingActions.completeOnboardingFailure({ 
              error: error.message || 'Error al completar el onboarding' 
            }))
          )
        )
      )
    )
  );

  completeOnboardingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OnboardingActions.completeOnboardingSuccess),
        tap(() => {
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );
}
