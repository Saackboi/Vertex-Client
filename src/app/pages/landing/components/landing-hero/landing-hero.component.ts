import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LandingHeroPreviewComponent } from '../landing-hero-preview/landing-hero-preview.component';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [CommonModule, NzButtonModule, LandingHeroPreviewComponent],
  templateUrl: './landing-hero.component.html',
  styleUrl: './landing-hero.component.css'
})
export class LandingHeroComponent {
  @Input() isAuthenticated$!: Observable<boolean>;
  @Input() isCompleted$!: Observable<boolean>;
  @Input() onboardingInProgress$!: Observable<boolean>;

  @Output() goToOnboarding = new EventEmitter<void>();
  @Output() goToLogin = new EventEmitter<void>();
}
