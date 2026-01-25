import { createAction, props } from '@ngrx/store';
import { Notification } from '../../services/notification-hub.service';

// Conexión SignalR
export const connectNotificationHub = createAction(
  '[Notifications] Connect Hub',
  props<{ token: string }>()
);

export const connectNotificationHubSuccess = createAction(
  '[Notifications] Connect Hub Success'
);

export const connectNotificationHubFailure = createAction(
  '[Notifications] Connect Hub Failure',
  props<{ error: string }>()
);

export const disconnectNotificationHub = createAction(
  '[Notifications] Disconnect Hub'
);

// Recepción de notificaciones
export const receiveNotification = createAction(
  '[Notifications] Receive Notification',
  props<{ notification: Notification }>()
);

export const loadNotificationHistory = createAction(
  '[Notifications] Load History',
  props<{ notifications: Notification[] }>()
);

// Marcar como leída
export const markNotificationAsRead = createAction(
  '[Notifications] Mark As Read',
  props<{ notificationId: string }>()
);

export const markAllNotificationsAsRead = createAction(
  '[Notifications] Mark All As Read'
);

// Notificaciones del sistema basadas en eventos NgRx
export const createSystemNotification = createAction(
  '[Notifications] Create System Notification',
  props<{ 
    title: string;
    message: string;
    notificationType: 'info' | 'success' | 'warning' | 'error';
  }>()
);

// Limpiar notificaciones
export const clearNotifications = createAction(
  '[Notifications] Clear All'
);
