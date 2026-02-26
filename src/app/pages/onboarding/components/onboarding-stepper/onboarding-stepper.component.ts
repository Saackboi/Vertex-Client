import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-onboarding-stepper',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './onboarding-stepper.component.html',
  styles: [
    `.stepper-container {
      margin-bottom: 2rem;
      padding: 0.75rem 0;
    }

    @media (min-width: 768px) {
      .stepper-container {
        margin-bottom: 3rem;
        padding: 1rem 0;
      }
    }

    .stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 1040px;
      margin: 0 auto;
      position: relative;
      padding: 0 1rem;
    }

    @media (min-width: 640px) {
      .stepper {
        padding: 0 2rem;
      }
    }

    .step-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      background: #f9fafb;
      padding: 0.375rem 0.75rem;
      position: relative;
      z-index: 10;
      min-width: 70px;
    }

    @media (min-width: 640px) {
      .step-wrapper {
        gap: 0.75rem;
        padding: 0.5rem 1.5rem;
        min-width: 100px;
      }
    }

    .step-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid #cbd5e1;
      background: var(--onboarding-card);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      color: #94a3b8;
      transition: all 0.3s;
      flex-shrink: 0;
    }

    .step-circle.active {
      background: #43A047;
      border-color: #43A047;
      border-width: 4px;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25), 0 0 0 4px rgba(16, 185, 129, 0.15);
    }

    .step-circle.completed {
      background: #43A047;
      border-color: #43A047;
      color: #ffffff;
    }

    .step-label {
      font-size: 0.65rem;
      font-weight: 500;
      color: #64748b;
      transition: color 0.3s;
      white-space: nowrap;
      text-align: center;
    }

    @media (min-width: 640px) {
      .step-label {
        font-size: 0.75rem;
      }
    }

    .step-label.active {
      color: #43A047;
      font-weight: 700;
    }

    .step-label.completed {
      color: #43A047;
      font-weight: 600;
    }

    .step-line {
      position: relative;
      height: 2px;
      flex: 1;
      background: #e2e8f0;
      margin: 0 -1rem;
      transition: background 0.3s;
    }

    .step-line.completed {
      background: #43A047;
    }

    .step-indicator {
      text-align: center;
      font-size: 0.875rem;
      color: var(--onboarding-muted);
      margin-top: 1rem;
      font-weight: 500;
    }

    :host-context(.dark) .step-wrapper {
      background: #0f172a;
    }

    :host-context(.dark) .step-circle {
      background: #0f172a;
      border-color: #475569;
      color: #64748b;
    }

    :host-context(.dark) .step-line {
      background: #1e293b;
    }`
  ]
})
export class OnboardingStepperComponent {
  @Input() currentStep$!: Observable<number>;
}
