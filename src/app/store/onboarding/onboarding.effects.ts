import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { OnboardingService } from '../../services/onboarding.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { NotificationService } from '../../core/services/notification.service';
import * as OnboardingActions from './onboarding.actions';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../auth/auth.selectors';

@Injectable()
export class OnboardingEffects {
  private actions$ = inject(Actions);
  private onboardingService = inject(OnboardingService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);
  private notificationService = inject(NotificationService);

  private store = inject(Store);
  loadResume$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.loadResume),
      withLatestFrom(this.store.select(selectIsAuthenticated)),
      exhaustMap(([, isAuthenticated]) => {
        if (!isAuthenticated) {
          return of(OnboardingActions.loadResumeFailure({ error: 'No autenticado' }));
        }
        return this.onboardingService.getResume().pipe(
          map((data) => {
            if (data) {
              return OnboardingActions.loadResumeSuccess({ data });
            }
            // Usuario nuevo sin datos previos - esto es normal, no es un error
            return OnboardingActions.loadResumeFailure({ 
              error: '' // Sin error, es simplemente un usuario nuevo
            });
          }),
          catchError((error) => {
            // Solo mostrar error si NO es un 404 (usuario nuevo)
            const errorMessage = this.errorHandler.getErrorMessage(error);
            return of(OnboardingActions.loadResumeFailure({ 
              error: errorMessage.includes('no encontrad') ? '' : errorMessage
            }));
          })
        );
      })
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
              error: this.errorHandler.getErrorMessage(error)
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
          this.notificationService.showSuccess('Progreso guardado correctamente');
          // Si el step cambió, actualizar en el store
          if (data && data.currentStep !== undefined) {
            // La acción updateCurrentStep se despachará desde el componente
          }
        })
      ),
    { dispatch: false }
  );

  saveProgressFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OnboardingActions.saveProgressFailure),
        tap(({ error }) => {
          if (error) {
            this.notificationService.showError(error);
          }
        })
      ),
    { dispatch: false }
  );

  loadResumeFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OnboardingActions.loadResumeFailure),
        tap(({ error }) => {
          // Solo mostrar error si realmente hay un mensaje (no es usuario nuevo)
          if (error && error.trim() !== '') {
            this.notificationService.showError(error);
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
              error: this.errorHandler.getErrorMessage(error)
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
          this.notificationService.showSuccess('¡Perfil completado! Bienvenido a Vertex.');
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  completeOnboardingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OnboardingActions.completeOnboardingFailure),
        tap(({ error }) => {
          if (error) {
            this.notificationService.showError(error);
          }
        })
      ),
    { dispatch: false }
  );
}
