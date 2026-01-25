import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import * as AuthActions from '../auth/auth.actions';
import * as OnboardingActions from './onboarding.actions';

@Injectable()
export class OnboardingGlobalEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  // Al iniciar la app, si no hay token, limpia el onboarding
  init$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType('@ngrx/effects/init'),
        tap(() => {
          const token = localStorage.getItem('authToken');
          if (!token) {
            localStorage.removeItem('userInfo');
            this.store.dispatch(OnboardingActions.resetOnboarding());
            this.store.dispatch(AuthActions.logoutSuccess());
          }
        })
      );
    },
    { dispatch: false }
  );
}
