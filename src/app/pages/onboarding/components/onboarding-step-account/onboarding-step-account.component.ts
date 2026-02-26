import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-onboarding-step-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzAlertModule, NzIconModule],
  templateUrl: './onboarding-step-account.component.html',
  styles: [
    `.form-card {
      background: var(--onboarding-card);
      border-radius: 1rem;
      box-shadow: var(--onboarding-shadow);
      border: 1px solid var(--onboarding-border);
      overflow: hidden;
      max-width: 1120px;
      margin: 0 auto;
    }

    .form-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--onboarding-text);
      margin: 0;
      padding: 2.25rem 2.25rem 0;
    }

    .account-form {
      padding: 2.25rem;
    }

    .form-alert {
      padding: 0 2.25rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .form-alert {
        padding: 0 1.25rem;
      }
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0;
    }

    .field-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--onboarding-muted);
    }

    .field-input,
    .field-textarea {
      width: 100%;
      padding: 0.625rem 1rem;
      background: var(--onboarding-surface);
      border: 1px solid var(--onboarding-border);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      color: var(--onboarding-text);
      transition: all 0.2s;
      outline: none;
    }

    .field-input.disabled,
    .field-input[readonly] {
      background: var(--onboarding-surface);
      color: var(--onboarding-muted);
      cursor: not-allowed;
    }

    .field-hint {
      font-size: 0.75rem;
      color: var(--onboarding-muted);
      margin-top: 0.25rem;
      display: block;
    }

    .field-input:focus,
    .field-textarea:focus {
      border-color: #43A047;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      background: var(--onboarding-card);
    }

    .field-input[readonly]:focus {
      border-color: var(--onboarding-border);
      box-shadow: none;
      background: var(--onboarding-surface);
    }

    .field-input::placeholder,
    .field-textarea::placeholder {
      color: var(--onboarding-muted);
    }

    .field-textarea {
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
    }

    .required {
      color: #ef4444;
      margin-left: 0.25rem;
    }

    .field-input.error,
    .field-textarea.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .field-input.error:focus,
    .field-textarea.error:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #ef4444;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-0.5rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .field-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
    }

    .char-count {
      font-size: 0.75rem;
      color: #64748b;
      margin-left: auto;
    }

    .char-count.warning {
      color: #f59e0b;
    }

    .char-count .min-chars {
      color: #94a3b8;
      font-style: italic;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 1.5rem;
    }

    .submit-button {
      background: #43A047 !important;
      color: #ffffff !important;
      font-weight: 600 !important;
      padding: 0.75rem 1.5rem !important;
      border-radius: 8px !important;
      border: none !important;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2) !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      transition: all 0.2s !important;
      font-size: 1rem !important;
      width: auto !important;
      height: auto !important;
    }

    .submit-button:hover {
      background: #2e7d32 !important;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3) !important;
    }

    .submit-button:active {
      transform: scale(0.98);
    }

    .submit-button:disabled,
    .submit-button[disabled] {
      background: #cbd5e1 !important;
      color: #94a3b8 !important;
      box-shadow: none !important;
      cursor: not-allowed !important;
      opacity: 0.55;
      transform: none !important;
    }

    .submit-button span {
      font-size: 14px;
    }

    :host-context(.dark) .field-label {
      color: var(--onboarding-muted);
    }

    :host-context(.dark) .field-input,
    :host-context(.dark) .field-textarea {
      background: var(--onboarding-card);
      border-color: var(--onboarding-border);
      color: var(--onboarding-text);
    }

    :host-context(.dark) .field-input.disabled,
    :host-context(.dark) .field-input[readonly] {
      background: var(--onboarding-surface);
      color: var(--onboarding-muted);
    }

    :host-context(.dark) .field-hint {
      color: var(--onboarding-muted);
    }

    :host-context(.dark) .field-input:focus,
    :host-context(.dark) .field-textarea:focus {
      border-color: #43A047;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    }

    :host-context(.dark) .field-input[readonly]:focus {
      border-color: #334155;
      box-shadow: none;
      background: #0f172a;
    }`
  ]
})
export class OnboardingStepAccountComponent {
  @Input() accountForm!: FormGroup;
  @Input() isLoading$!: Observable<boolean>;
  @Input() isSummaryTooShort = false;
  @Input() hasError!: (formGroup: FormGroup, fieldName: string) => boolean;
  @Input() getErrorMessage!: (formGroup: FormGroup, fieldName: string) => string;

  @Output() saveAndContinue = new EventEmitter<void>();
}
