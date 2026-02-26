import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, from } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { NotificationHubService } from '../../services/notification-hub.service';
import { NotificationService } from '../../core/services/notification.service';
import * as NotificationsActions from './notifications.actions';
import * as AuthActions from '../auth/auth.actions';
import * as OnboardingActions from '../onboarding/onboarding.actions';

@Injectable()
export class NotificationsEffects {
  private actions$ = inject(Actions);
  private notificationHub = inject(NotificationHubService);
  private notificationService = inject(NotificationService);
  private store = inject(Store);
  private router = inject(Router);

  /**
   * Conectar al hub cuando hay login/register exitoso
   */
  connectOnAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.registerSuccess, AuthActions.restoreSession),
      map(({ token }) => NotificationsActions.connectNotificationHub({ token }))
    )
  );

  /**
   * Ejecutar la conexión al hub
   */
  connectHub$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.connectNotificationHub),
      switchMap(({ token }) =>
        from(this.notificationHub.startConnection(token)).pipe(
          map(() => NotificationsActions.connectNotificationHubSuccess()),
          catchError((error) => {
            console.warn('[NotificationEffects] No se pudo conectar al hub:', error.message || error);
            return of(NotificationsActions.connectNotificationHubFailure({ 
              error: 'Servicio de notificaciones no disponible' 
            }));
          })
        )
      )
    )
  );

  /**
   * Desconectar del hub cuando hay logout
   */
  disconnectOnLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => this.notificationHub.stopConnection()),
      map(() => NotificationsActions.disconnectNotificationHub())
    )
  );

  /**
   * Cargar historial cuando se conecta al hub
   */
  loadHistoryOnConnect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.connectNotificationHubSuccess),
      switchMap(() =>
        this.notificationHub.fetchHistory().pipe(
          map((notifications) => NotificationsActions.loadNotificationHistory({ notifications })),
          catchError(() => of(NotificationsActions.loadNotificationHistory({ notifications: [] })))
        )
      )
    )
  );

  syncNotifications$ = createEffect(() =>
    this.notificationHub.notifications$.pipe(
      map((notifications) => NotificationsActions.loadNotificationHistory({ notifications }))
    )
  );

  /**
   * Mostrar toast cuando llega una nueva notificación de SignalR
   */
  showNotificationToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsActions.receiveNotification),
        tap(({ notification }) => {
          // Mostrar el toast según el tipo de notificación
          switch (notification.type) {
            case 'success':
              this.notificationService.showSuccess(notification.message);
              break;
            case 'warning':
              this.notificationService.showWarning(notification.message);
              break;
            case 'error':
              this.notificationService.showError(notification.message);
              break;
            case 'info':
            default:
              this.notificationService.showInfo(notification.message);
          }
        })
      ),
    { dispatch: false }
  );

  /**
   * Marcar notificación como leída
   */
  markAsRead$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsActions.markNotificationAsRead),
        tap(({ notificationId }) => this.notificationHub.markAsRead(notificationId))
      ),
    { dispatch: false }
  );

  /**
   * Marcar todas como leídas
   */
  markAllAsRead$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsActions.markAllNotificationsAsRead),
        tap(() => this.notificationHub.markAllAsRead())
      ),
    { dispatch: false }
  );

  /**
   * Notificación de bienvenida al registrarse
   */
  welcomeNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      map(() => NotificationsActions.createSystemNotification({
        title: '¡Bienvenido a Vertex!',
        message: 'Tu cuenta ha sido creada exitosamente. Completa tu perfil para comenzar.',
        notificationType: 'success'
      }))
    )
  );

  /**
   * Notificación al completar onboarding
   */
  onboardingCompleteNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.completeOnboardingSuccess),
      map(() => NotificationsActions.createSystemNotification({
        title: '¡Perfil completado!',
        message: 'Has completado tu perfil profesional exitosamente.',
        notificationType: 'success'
      }))
    )
  );

  /**
   * Notificación de error en onboarding
   */
  onboardingErrorNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.saveProgressFailure, OnboardingActions.completeOnboardingFailure),
      map(({ error }) => NotificationsActions.createSystemNotification({
        title: 'Error al guardar',
        message: error,
        notificationType: 'error'
      }))
    )
  );

  /**
   * Notificación de error de autenticación
   */
  authErrorNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure, AuthActions.registerFailure),
      map(({ error }) => NotificationsActions.createSystemNotification({
        title: 'Error de autenticación',
        message: error,
        notificationType: 'error'
      }))
    )
  );
}
