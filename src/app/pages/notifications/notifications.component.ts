import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { environment } from '../../../environments/environment';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

@Component({
  selector: 'app-notifications',
  imports: [
    CommonModule,
    NzIconModule,
    NzButtonModule,
    NzAvatarModule,
    NzBadgeModule
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  readonly notifications = signal<Notification[]>([]);
  readonly isDarkMode = signal(false);

  ngOnInit(): void {
    this.loadNotifications();
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(v => !v);
    document.documentElement.classList.toggle('dark');
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goBack(): void {
    this.router.navigate(['/onboarding']);
  }

  loadNotifications(): void {
    this.http.get<Notification[]>(`${environment.apiUrl}/notifications`)
      .subscribe({
        next: (data) => this.notifications.set(data),
        error: (err) => console.error('Failed to load notifications:', err)
      });
  }

  markAsRead(id: number): void {
    this.http.post(`${environment.apiUrl}/notifications/${id}/read`, {})
      .subscribe({
        next: () => {
          this.notifications.update(notifications =>
            notifications.map(n => n.id === id ? { ...n, read: true } : n)
          );
        },
        error: (err) => console.error('Failed to mark as read:', err)
      });
  }

  deleteNotification(id: number): void {
    this.http.delete(`${environment.apiUrl}/notifications/${id}`)
      .subscribe({
        next: () => {
          this.notifications.update(notifications =>
            notifications.filter(n => n.id !== id)
          );
        },
        error: (err) => console.error('Failed to delete notification:', err)
      });
  }

  getUnreadCount(): number {
    return this.notifications().filter(n => !n.read).length;
  }
}
