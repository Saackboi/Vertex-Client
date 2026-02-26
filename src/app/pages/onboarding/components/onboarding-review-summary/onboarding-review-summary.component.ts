import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-onboarding-review-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding-review-summary.component.html',
  styles: [
    `.summary-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .summary-card {
      background: var(--onboarding-card);
      border: 1px solid var(--onboarding-border);
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: var(--onboarding-shadow);
    }

    @media (min-width: 768px) {
      .summary-card {
        padding: 1.5rem;
      }
    }

    .summary-card-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--onboarding-text);
      margin: 0 0 1rem 0;
    }

    .summary-card-content {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      font-size: 0.875rem;
    }

    .summary-label {
      color: var(--onboarding-muted);
    }

    .summary-value {
      font-weight: 500;
      color: var(--onboarding-text);
      text-align: right;
    }

    .summary-exp-item {
      padding-left: 1rem;
      border-left: 2px solid rgba(16, 185, 129, 0.3);
      margin-bottom: 1.25rem;
    }

    .summary-exp-item.last {
      margin-bottom: 0;
    }

    .summary-exp-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--onboarding-text);
      margin: 0 0 0.25rem 0;
      line-height: 1.4;
    }

    .summary-exp-company {
      font-size: 0.75rem;
      color: #64748b;
      margin: 0;
      line-height: 1.4;
    }

    .summary-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .summary-skill-tag {
      padding: 0.375rem 0.5rem;
      background: var(--onboarding-surface);
      color: #475569;
      font-size: 0.75rem;
      border-radius: 4px;
    }

    .review-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-top: 1rem;
    }

    .nav-button {
      width: 100%;
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .nav-button.primary {
      background: #43A047;
      color: white;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    }

    .nav-button.primary:hover:not(:disabled) {
      background: #2e7d32;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
    }

    .nav-button.primary:disabled {
      background: #cbd5e1;
      color: var(--onboarding-muted);
      opacity: 1;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    .nav-button.secondary {
      background: var(--onboarding-card);
      color: var(--onboarding-muted);
      border: 2px solid var(--onboarding-border);
    }

    .nav-button.secondary:hover {
      background: var(--onboarding-surface);
      border-color: #cbd5e1;
    }

    .nav-button.full-width {
      width: 100%;
      flex: none;
    }`
  ]
})
export class OnboardingReviewSummaryComponent {
  @Input() accountForm!: FormGroup;
  @Input() experiences!: FormArray;
  @Input() skills: string[] = [];
  @Input() isLoading$!: Observable<boolean>;
  @Input() canFinishOnboarding = false;

  @Output() previousStep = new EventEmitter<void>();
  @Output() finishOnboarding = new EventEmitter<void>();
}
