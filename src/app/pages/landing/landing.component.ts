import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AppLogoComponent } from '../../components/app-logo.component';
import { AppFooterComponent } from '../../components/app-footer.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
// import { NzDropdownMenuComponent, NzDropdownDirective } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { map } from 'rxjs/operators';
import { selectIsAuthenticated, selectUserFullName } from '../../store/auth/auth.selectors';
import { selectIsCompleted } from '../../store/onboarding/onboarding.selectors';
import { selectOnboardingInProgress } from '../../store/onboarding/onboarding.inprogress.selector';
import * as AuthActions from '../../store/auth/auth.actions';
import { NavigationUtils } from '../../core/utils/navigation.utils';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule, 
    NzButtonModule, 
    NzIconModule, 
    NzAvatarModule, 
    // NzDropdownMenuComponent, 
    // NzDropdownDirective,
    NzMenuModule,
    NzDropDownModule,
    AppLogoComponent,
    AppFooterComponent
  ],
  providers: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  readonly isAuthenticated$: Observable<boolean> = this.store.select(selectIsAuthenticated);
  readonly userFullName$: Observable<string> = this.store.select(selectUserFullName);
  readonly isCompleted$: Observable<boolean> = this.store.select(selectIsCompleted);
  readonly onboardingInProgress$: Observable<boolean> = this.store.select(selectOnboardingInProgress).pipe(
    map((val: unknown) => !!val)
  );
  
  constructor() {}

  goToLogin(): void {
    NavigationUtils.goToLogin(this.router);
  }

  goToOnboarding(): void {
    NavigationUtils.goToOnboarding(this.router);
  }

  goToLanding(): void {
    NavigationUtils.goToLanding(this.router);
  }

  logout(): void {
    NavigationUtils.logout(this.router, this.store);
  }
}
