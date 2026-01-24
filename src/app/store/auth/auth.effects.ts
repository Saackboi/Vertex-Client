import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { OnboardingService } from '../../services/onboarding.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private onboardingService = inject(OnboardingService);
  private router = inject(Router);

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
                token: localStorage.getItem('auth_token') || '' 
              });
            }
            return AuthActions.loginFailure({ error: 'No se pudo obtener información del usuario' });
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message || 'Error en el login' }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => console.log('[AuthEffects] Login exitoso, verificando estado de onboarding...')),
        switchMap(() => 
          this.onboardingService.getResume().pipe(
            tap((status) => {
              console.log('[AuthEffects] Estado de onboarding obtenido:', status);
              // Si el onboarding está completado, ir al dashboard
              // Si no está completado o no existe, ir al onboarding
              if (status && status.isCompleted) {
                console.log('[AuthEffects] Onboarding completado, redirigiendo a /dashboard');
                this.router.navigate(['/dashboard']);
              } else {
                console.log('[AuthEffects] Onboarding NO completado, redirigiendo a /onboarding');
                this.router.navigate(['/onboarding']);
              }
            }),
            catchError((error) => {
              console.error('[AuthEffects] Error al obtener estado de onboarding:', error);
              // En caso de error, ir al onboarding por defecto
              this.router.navigate(['/onboarding']);
              return of(null);
            })
          )
        )
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
                token: localStorage.getItem('auth_token') || '' 
              });
            }
            return AuthActions.registerFailure({ error: 'No se pudo obtener información del usuario' });
          }),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: error.message || 'Error en el registro' }))
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
          this.router.navigate(['/onboarding']);
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
          this.router.navigate(['/login']);
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
