import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { AppLogoComponent } from '../../../../components/app-logo.component';

@Component({
  selector: 'app-onboarding-header',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzBadgeModule,
    NzAvatarModule,
    NzMenuModule,
    NzDropDownModule,
    AppLogoComponent
  ],
  templateUrl: './onboarding-header.component.html',
  styles: [
    `.onboarding-header {
      background: var(--onboarding-card);
      border-bottom: 1px solid var(--onboarding-border);
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .header-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-links {
      display: none;
      gap: 1.5rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .nav-links a {
      color: var(--onboarding-muted);
      cursor: pointer;
      transition: color 0.2s;
    }

    .nav-links a:hover {
      color: var(--onboarding-accent);
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding-left: 1.5rem;
      border-left: 1px solid var(--onboarding-border);
    }

    .icon-button {
      padding: 0.5rem;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: #64748b;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .icon-button:hover {
      background: var(--onboarding-surface);
    }

    .icon-button span {
      font-size: 20px;
    }

    .user-avatar {
      cursor: pointer;
      transition: transform 0.2s;
    }

    .user-avatar:hover {
      transform: scale(1.05);
    }

    @media (min-width: 768px) {
      .nav-links {
        display: flex;
      }
    }

    :host-context(.dark) .onboarding-header {
      background: var(--onboarding-card);
      border-bottom-color: var(--onboarding-border);
    }

    :host-context(.dark) .nav-links a {
      color: #94a3b8;
    }

    :host-context(.dark) .nav-links a:hover {
      color: #43A047;
    }

    :host-context(.dark) .action-buttons {
      border-left-color: var(--onboarding-border);
    }

    :host-context(.dark) .icon-button {
      color: #94a3b8;
    }

    :host-context(.dark) .icon-button:hover {
      background: #1e293b;
    }`
  ]
})
export class OnboardingHeaderComponent {
  @Input() isDarkMode = false;
  @Input() notificationCount$!: Observable<number>;
  @Input() userFullName$!: Observable<string>;

  @Output() toggleDarkMode = new EventEmitter<void>();
  @Output() navigateToNotifications = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
