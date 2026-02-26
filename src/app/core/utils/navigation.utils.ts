import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';

export class NavigationUtils {
  static goTo(router: Router, route: string) {
    router.navigate([route]);
  }

  static goToLogin(router: Router) {
    router.navigate(['/login']);
  }

  static logout(router: Router, store: Store) {
    store.dispatch(AuthActions.logout());
  }

  static goToDashboard(router: Router) {
    router.navigate(['/']);
  }

  static goToOnboarding(router: Router) {
    router.navigate(['/onboarding']);
  }

  static goToLanding(router: Router) {
    router.navigate(['/']);
  }

  static goToNotifications(router: Router) {
    router.navigate(['/notifications']);
  }
}
