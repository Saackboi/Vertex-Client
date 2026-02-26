// ...existing code...
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AppFooterComponent } from '../../components/app-footer.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NotificationsHeaderComponent } from './components/notifications-header/notifications-header.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigationUtils } from '../../core/utils/navigation.utils';
import { Notification } from '../../services/notification-hub.service';
import * as NotificationsActions from '../../store/notifications/notifications.actions';
import { 
  selectAllNotifications, 
  selectUnreadCount,
  selectIsConnected
} from '../../store/notifications/notifications.selectors';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzButtonModule,
    NotificationsHeaderComponent,
    AppFooterComponent
  ],
  providers: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly message = inject(NzMessageService);
  private readonly destroy$ = new Subject<void>();

  // Observables del store de notificaciones
  readonly notifications$: Observable<Notification[]> = this.store.select(selectAllNotifications);
  readonly unreadCount$: Observable<number> = this.store.select(selectUnreadCount);
  readonly isConnected$: Observable<boolean> = this.store.select(selectIsConnected);

  isDarkMode = false;


  ngOnInit(): void {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    // No necesitamos inicializar nada, el effect se encarga de conectar automáticamente
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark');
  }

  navigateToDashboard(): void {
    NavigationUtils.goToDashboard(this.router);
  }

  navigateToProfile(): void {
    NavigationUtils.goToOnboarding(this.router);
  }

  goBack(): void {
    NavigationUtils.goToOnboarding(this.router);
  }

  markAsRead(id: string): void {
    this.store.dispatch(NotificationsActions.markNotificationAsRead({ notificationId: id }));
    this.message.success('Notificación marcada como leída');
  }

  markAllAsRead(): void {
    this.store.dispatch(NotificationsActions.markAllNotificationsAsRead());
    this.message.success('Todas las notificaciones marcadas como leídas');
  }

  deleteNotification(id: string): void {
    // TODO: Implementar acción para eliminar notificación
    this.message.success('Notificación eliminada');
  }

  logout(): void {
    NavigationUtils.logout(this.router, this.store);
  }
}
