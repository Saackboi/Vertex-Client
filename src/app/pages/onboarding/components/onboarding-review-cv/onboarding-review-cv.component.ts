import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-onboarding-review-cv',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './onboarding-review-cv.component.html',
  styles: [
    `.cv-preview {
      background: transparent;
      border: none;
      border-radius: 0;
      padding: 0;
      box-shadow: none;
      height: auto;
      max-height: none;
      overflow: visible;
      min-width: 0;
    }

    .cv-sheet {
      width: 100%;
      max-width: 780px;
      margin: 0 auto;
      background: var(--onboarding-card);
      border: 1px solid var(--onboarding-border);
      border-radius: 12px;
      box-shadow: var(--onboarding-shadow);
      height: auto;
      max-height: none;
      overflow: visible;
      font-family: 'Georgia', 'Times New Roman', serif;
    }

    .cv-sheet-content {
      min-height: 1056px;
      padding: 3rem 2.75rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    @media (max-width: 900px) {
      .cv-sheet {
        height: auto;
        max-height: none;
        overflow: visible;
      }

      .cv-sheet-content {
        padding: 2.5rem 2rem;
        min-height: 960px;
      }
    }

    @media (max-width: 640px) {
      .cv-sheet {
        height: auto;
        max-height: none;
        overflow: visible;
      }

      .cv-sheet-content {
        padding: 2rem 1.5rem;
        min-height: 960px;
      }
    }

    .cv-header {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2rem;
      align-items: center;
      padding-bottom: 1.75rem;
      border-bottom: 2px solid rgba(67, 160, 71, 0.2);
    }

    @media (max-width: 640px) {
      .cv-header {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }

    .cv-photo {
      width: 140px;
      height: 180px;
      border-radius: 12px;
      border: 2px solid rgba(67, 160, 71, 0.3);
      background: var(--onboarding-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--onboarding-accent);
      font-size: 2.5rem;
      flex-shrink: 0;
    }

    .cv-header-info {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .cv-name {
      font-size: 2.1rem;
      font-weight: 700;
      color: var(--onboarding-text);
      margin: 0;
      line-height: 1.1;
      overflow-wrap: anywhere;
    }

    .cv-role {
      font-size: 1rem;
      font-weight: 600;
      color: var(--onboarding-accent);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .cv-subline {
      font-size: 0.95rem;
      color: var(--onboarding-muted);
      margin: 0;
    }

    .cv-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .cv-section-title {
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--onboarding-accent);
      margin: 0;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid rgba(67, 160, 71, 0.2);
    }

    .cv-text {
      font-size: 0.98rem;
      color: var(--onboarding-muted);
      line-height: 1.7;
      margin: 0;
      overflow-wrap: anywhere;
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    }

    .cv-experience-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .cv-entry {
      padding-top: 1.5rem;
      border-top: 1px solid var(--onboarding-border);
    }

    .cv-entry.first {
      padding-top: 0;
      border-top: none;
    }

    .cv-entry-header {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-bottom: 0.5rem;
    }

    @media (min-width: 640px) {
      .cv-entry-header {
        flex-direction: row;
        justify-content: space-between;
        align-items: start;
        gap: 1rem;
      }
    }

    .cv-entry-title {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .cv-entry-role {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--onboarding-text);
      overflow-wrap: anywhere;
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    }

    .cv-entry-company {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--onboarding-muted);
      overflow-wrap: anywhere;
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    }

    .cv-entry-date {
      font-size: 0.8rem;
      color: var(--onboarding-muted);
      background: var(--onboarding-surface);
      border: 1px solid var(--onboarding-border);
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      align-self: flex-start;
      white-space: nowrap;
    }

    .cv-entry-description {
      font-size: 0.95rem;
      color: var(--onboarding-muted);
      line-height: 1.65;
      margin: 0;
      overflow-wrap: anywhere;
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    }

    .cv-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .cv-skill-tag {
      padding: 0.35rem 0.75rem;
      background: var(--onboarding-accent-soft);
      color: var(--onboarding-accent);
      border: 1px solid rgba(67, 160, 71, 0.2);
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .cv-empty {
      font-size: 0.9rem;
      color: var(--onboarding-muted);
      margin: 0;
      overflow-wrap: anywhere;
    }`
  ]
})
export class OnboardingReviewCvComponent {
  @Input() accountForm!: FormGroup;
  @Input() resumeData: any = {};
  @Input() skills: string[] = [];
}
