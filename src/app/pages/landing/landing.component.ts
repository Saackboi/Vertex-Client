import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppFooterComponent } from '../../components/app-footer.component';
import { LandingHeaderComponent } from './components/landing-header/landing-header.component';
import { LandingHeroComponent } from './components/landing-hero/landing-hero.component';
import { LandingFeaturesComponent } from './components/landing-features/landing-features.component';
import { LandingCtaComponent } from './components/landing-cta/landing-cta.component';
import { map } from 'rxjs/operators';
import { selectIsAuthenticated, selectUserFullName } from '../../store/auth/auth.selectors';
import { selectIsCompleted } from '../../store/onboarding/onboarding.selectors';
import { selectOnboardingInProgress } from '../../store/onboarding/onboarding.inprogress.selector';
import * as OnboardingActions from '../../store/onboarding/onboarding.actions';
import { NavigationUtils } from '../../core/utils/navigation.utils';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    LandingHeaderComponent,
    LandingHeroComponent,
    LandingFeaturesComponent,
    LandingCtaComponent,
    AppFooterComponent
  ],
  providers: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  isDarkMode = document.documentElement.classList.contains('dark');

  readonly isAuthenticated$: Observable<boolean> = this.store.select(selectIsAuthenticated);
  readonly userFullName$: Observable<string> = this.store.select(selectUserFullName);
  readonly isCompleted$: Observable<boolean> = this.store.select(selectIsCompleted);
  readonly onboardingInProgress$: Observable<boolean> = this.store.select(selectOnboardingInProgress).pipe(
    map((val: unknown) => !!val)
  );
  

  goToLogin(): void {
    NavigationUtils.goToLogin(this.router);
  }

  goToOnboarding(): void {
    NavigationUtils.goToOnboarding(this.router);
  }

  goToLanding(): void {
    NavigationUtils.goToLanding(this.router);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  logout(): void {
    NavigationUtils.logout(this.router, this.store);
  }
}
