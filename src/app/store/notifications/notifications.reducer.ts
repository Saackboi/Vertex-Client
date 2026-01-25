import { createReducer, on } from '@ngrx/store';
import { Notification } from '../../services/notification-hub.service';
import * as NotificationsActions from './notifications.actions';
import * as AuthActions from '../auth/auth.actions';

export interface NotificationsState {
  notifications: Notification[];
  connected: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: NotificationsState = {
  notifications: [],
  connected: false,
  loading: false,
  error: null
};

export const notificationsReducer = createReducer(
  initialState,

  // Conexión - limpiar notificaciones antes de conectar para cargar frescas desde BD
  on(NotificationsActions.connectNotificationHub, (state): NotificationsState => ({
    ...initialState,
    loading: true,
    error: null
  })),

  on(NotificationsActions.connectNotificationHubSuccess, (state): NotificationsState => ({
    ...state,
    connected: true,
    loading: false,
    error: null
  })),

  on(NotificationsActions.connectNotificationHubFailure, (state, { error }): NotificationsState => ({
    ...state,
    connected: false,
    loading: false,
    error
  })),

  on(NotificationsActions.disconnectNotificationHub, (state): NotificationsState => ({
    ...state,
    connected: false,
    notifications: []
  })),

  // Recepción de notificaciones
  on(NotificationsActions.receiveNotification, (state, { notification }): NotificationsState => {
    // Patrón upsert: buscar por ID si ya existe (Backend usa upsert para progreso)
    const exists = state.notifications.some((n: Notification) => n.id === notification.id);
    const updated = exists
      ? state.notifications.map((n: Notification) => n.id === notification.id ? notification : n)
      : [notification, ...state.notifications];
    
    return {
      ...state,
      notifications: updated
    };
  }),

  on(NotificationsActions.loadNotificationHistory, (state, { notifications }): NotificationsState => ({
    ...state,
    notifications
  })),

  // Marcar como leída
  on(NotificationsActions.markNotificationAsRead, (state, { notificationId }): NotificationsState => ({
    ...state,
    notifications: state.notifications.map((n: Notification) =>
      n.id === notificationId ? { ...n, read: true } : n
    )
  })),

  on(NotificationsActions.markAllNotificationsAsRead, (state): NotificationsState => ({
    ...state,
    notifications: state.notifications.map((n: Notification) => ({ ...n, read: true }))
  })),

  // Notificación del sistema
  on(NotificationsActions.createSystemNotification, (state, { title, message, notificationType }): NotificationsState => ({
    ...state,
    notifications: [
      {
        id: `system-${Date.now()}`,
        title,
        message,
        type: notificationType,
        read: false,
        timestamp: new Date().toISOString()
      },
      ...state.notifications
    ]
  })),

  // Limpiar
  on(NotificationsActions.clearNotifications, (state): NotificationsState => ({
    ...state,
    notifications: []
  }))
);
