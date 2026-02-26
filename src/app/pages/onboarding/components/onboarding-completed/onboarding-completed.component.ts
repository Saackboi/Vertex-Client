import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-onboarding-completed',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule],
  templateUrl: './onboarding-completed.component.html',
  styles: [
    `.completed-container {
      max-width: 1200px;
      margin: 2rem auto 3rem;
      padding: 0 1.5rem;
    }

    .completed-hero {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem 1.75rem;
      background: var(--onboarding-surface);
      border: 1px solid var(--onboarding-border);
      border-radius: 16px;
      margin-bottom: 1.5rem;
    }

    .hero-icon {
      font-size: 2.75rem;
      color: #43A047;
      animation: successPulse 2s ease-in-out infinite;
    }

    @keyframes successPulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.9;
      }
    }

    .hero-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--onboarding-text);
      margin: 0 0 0.35rem 0;
      line-height: 1.2;
    }

    .hero-description {
      font-size: 0.95rem;
      color: var(--onboarding-muted);
      margin: 0;
      line-height: 1.5;
    }

    .hero-text {
      display: flex;
      flex-direction: column;
    }

    .profile-bento {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 1.5rem;
    }

    .bento-card {
      background: var(--onboarding-card);
      border: 1px solid var(--onboarding-border);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: var(--onboarding-shadow);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      min-width: 0;
    }

    .bento-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--onboarding-accent);
      font-weight: 700;
    }

    .bento-summary {
      grid-column: span 8;
    }

    .bento-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--onboarding-text);
      margin: 0;
    }

    .bento-text {
      font-size: 0.95rem;
      color: var(--onboarding-muted);
      line-height: 1.6;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      overflow-wrap: anywhere;
    }

    .bento-stats {
      grid-column: span 4;
    }

    .bento-stat-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .bento-stat {
      background: var(--onboarding-surface);
      border-radius: 12px;
      padding: 1rem;
      border: 1px solid var(--onboarding-border);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--onboarding-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--onboarding-text);
    }

    .bento-experience {
      grid-column: span 8;
    }

    .bento-experience-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .bento-exp-item {
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--onboarding-border);
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .bento-exp-item:last-child {
      border-bottom: none;
    }

    .bento-exp-main {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .bento-exp-role {
      font-weight: 600;
      color: var(--onboarding-text);
      overflow-wrap: anywhere;
    }

    .bento-exp-company {
      color: var(--onboarding-muted);
      overflow-wrap: anywhere;
    }

    .bento-exp-date {
      font-size: 0.85rem;
      color: var(--onboarding-muted);
      overflow-wrap: anywhere;
    }

    .bento-skills {
      grid-column: span 4;
    }

    .bento-skills-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .bento-skill {
      background: var(--onboarding-accent-soft);
      color: #2e7d32;
      padding: 0.4rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      border: 1px solid rgba(67, 160, 71, 0.35);
    }

    .bento-actions {
      grid-column: span 4;
    }

    .bento-actions button {
      align-self: flex-start;
    }

    .bento-hint {
      font-size: 0.85rem;
      color: var(--onboarding-muted);
      margin: 0;
      overflow-wrap: anywhere;
    }

    .bento-info {
      grid-column: span 8;
      background: #fffbeb;
      border-color: #fde68a;
    }

    .bento-info p {
      margin: 0;
      color: #92400e;
      line-height: 1.6;
      overflow-wrap: anywhere;
    }

    :host-context(.dark) .bento-info {
      background: rgba(245, 158, 11, 0.08);
      border-color: rgba(245, 158, 11, 0.35);
    }

    :host-context(.dark) .bento-info p {
      color: #fbbf24;
    }

    .bento-empty {
      color: var(--onboarding-muted);
      margin: 0;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 1.75rem;
      }

      .completed-container {
        padding: 0 1rem;
      }

      .completed-hero {
        flex-direction: column;
        align-items: flex-start;
        padding: 1.25rem;
      }

      .hero-icon {
        font-size: 2.25rem;
      }

      .profile-bento {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .bento-summary,
      .bento-stats,
      .bento-experience,
      .bento-skills,
      .bento-actions,
      .bento-info {
        grid-column: span 1;
      }

      .bento-card {
        width: 100%;
      }

      .bento-card {
        padding: 1.25rem;
      }

      .bento-name {
        font-size: 1.25rem;
      }

      .stat-value {
        font-size: 1.25rem;
      }

      .bento-actions button {
        width: 100%;
      }
    }

    @media (max-width: 900px) {
      .profile-bento {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .bento-summary,
      .bento-stats,
      .bento-experience,
      .bento-skills,
      .bento-actions,
      .bento-info {
        grid-column: span 1;
      }

      .bento-stat-grid {
        grid-template-columns: 1fr;
      }

      .bento-actions button {
        width: 100%;
      }
    }

    @media (max-width: 600px) {
      .completed-container {
        margin: 1.5rem auto 2.5rem;
      }

      .hero-title {
        font-size: 1.6rem;
      }

      .hero-description {
        font-size: 0.9rem;
      }

      .bento-title {
        font-size: 0.75rem;
      }

      .bento-name {
        font-size: 1.15rem;
      }

      .stat-value {
        font-size: 1.15rem;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 1.5rem;
      }

      .hero-description {
        font-size: 0.9rem;
      }

      .bento-card {
        padding: 1rem;
      }

      .bento-title {
        font-size: 0.75rem;
      }

      .bento-stat-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 1024px) {
      .profile-bento {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .bento-summary,
      .bento-experience,
      .bento-info {
        grid-column: span 2;
      }

      .bento-stats,
      .bento-skills,
      .bento-actions {
        grid-column: span 1;
      }
    }`
  ]
})
export class OnboardingCompletedComponent {
  @Input() accountForm!: FormGroup;
  @Input() experiences!: FormArray;
  @Input() skills: string[] = [];

  @Output() navigateToDashboard = new EventEmitter<void>();
}
