import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, EMPTY } from 'rxjs';
import { map, exhaustMap, catchError, tap, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { OnboardingService } from '../../services/onboarding.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { NotificationService } from '../../core/services/notification.service';
import * as AuthActions from './auth.actions';
import * as OnboardingActions from '../onboarding/onboarding.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private onboardingService = inject(OnboardingService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);
  private notificationService = inject(NotificationService);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType('@ngrx/effects/init'),
      switchMap(() => {
        const token = this.authService.getToken();
        const user = this.authService.getUserInfo();
        if (token && user) {
          return of(AuthActions.restoreSession({ user, token }));
        }
        return EMPTY;
      })
    )
  );

  restoreSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.restoreSession),
      map(() => OnboardingActions.loadResume())
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) => {
            // El servicio ya guarda el token en localStorage
            const user = this.authService.getUserInfo();
            if (user) {
              return AuthActions.loginSuccess({ 
                user, 
                token: localStorage.getItem('authToken') || '' 
              });
            }
            return AuthActions.loginFailure({ error: 'No se pudo obtener información del usuario' });
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: this.errorHandler.getErrorMessage(error) }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token }) => {
          if (!token || token.trim() === '') {
            console.error('[AuthEffects] Token vacío después de login exitoso');
            this.notificationService.showError('Error al guardar sesión');
            return;
          }
          this.notificationService.showSuccess('¡Bienvenido de nuevo!');
          console.log('[AuthEffects] Login exitoso, redirigiendo a /onboarding');
          // Siempre redirigir a onboarding (cargará el progreso del usuario)
          this.router.navigate(['/onboarding']);
        })
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          // No mostrar notificación aquí porque el interceptor ya lo hace para errores de red/servidor
          // Solo mostrar si es un error de credenciales (401) que viene del backend
          if (error.includes('Email o contraseña incorrectos')) {
            this.notificationService.showError(error);
          }
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ userData }) =>
        this.authService.register(userData).pipe(
          map((response) => {
            const user = this.authService.getUserInfo();
            if (user) {
              return AuthActions.registerSuccess({ 
                user, 
                token: localStorage.getItem('authToken') || '' 
              });
            }
            return AuthActions.registerFailure({ error: 'No se pudo obtener información del usuario' });
          }),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: this.errorHandler.getErrorMessage(error) }))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          this.notificationService.showSuccess('¡Cuenta creada exitosamente! Completa tu perfil.');
          this.router.navigate(['/onboarding']);
        })
      ),
    { dispatch: false }
  );

  registerFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerFailure),
        tap(({ error }) => {
          // No mostrar notificación aquí porque el interceptor ya lo hace para errores de red/servidor
          // Solo mostrar si es un error de validación que viene del backend
          if (error.includes('ya está registrado') || error.includes('no son válidos')) {
            this.notificationService.showError(error);
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.logout();
      }),
      map(() => AuthActions.logoutSuccess())
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          // Navegar al landing y reemplazar el historial
          this.router.navigate(['/'], { replaceUrl: true });
        })
      ),
    { dispatch: false }
  );

  loadUserInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserInfo),
      map(() => {
        const user = this.authService.getUserInfo();
        if (user) {
          return AuthActions.loadUserInfoSuccess({ user });
        }
        return AuthActions.loadUserInfoFailure({ error: 'No hay información de usuario' });
      })
    )
  );
}
