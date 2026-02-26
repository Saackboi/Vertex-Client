import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OnboardingReviewCvComponent } from '../onboarding-review-cv/onboarding-review-cv.component';
import { OnboardingReviewSummaryComponent } from '../onboarding-review-summary/onboarding-review-summary.component';

@Component({
  selector: 'app-onboarding-step-review',
  standalone: true,
  imports: [CommonModule, OnboardingReviewCvComponent, OnboardingReviewSummaryComponent],
  templateUrl: './onboarding-step-review.component.html',
  styles: [
    `.review-container {
      width: 100%;
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 1.5rem;
      padding-bottom: 4rem;
    }

    @media (max-width: 768px) {
      .review-container {
        padding: 0 0.75rem;
      }
    }

    .review-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 1024px) {
      .review-grid {
        grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
        gap: 2rem;
        align-items: start;
      }
    }`
  ]
})
export class OnboardingStepReviewComponent {
  @Input() accountForm!: FormGroup;
  @Input() resumeData: any = {};
  @Input() experiences!: FormArray;
  @Input() skills: string[] = [];
  @Input() isLoading$!: Observable<boolean>;
  @Input() canFinishOnboarding = false;

  @Output() previousStep = new EventEmitter<void>();
  @Output() finishOnboarding = new EventEmitter<void>();
}
