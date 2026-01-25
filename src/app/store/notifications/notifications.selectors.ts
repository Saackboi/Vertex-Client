import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationsState } from './notifications.reducer';

export const selectNotificationsState = createFeatureSelector<NotificationsState>('notifications');

export const selectAllNotifications = createSelector(
  selectNotificationsState,
  (state) => state.notifications
);

export const selectUnreadNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter(n => !n.read)
);

export const selectUnreadCount = createSelector(
  selectUnreadNotifications,
  (notifications) => notifications.length
);

export const selectIsConnected = createSelector(
  selectNotificationsState,
  (state) => state.connected
);

export const selectNotificationsLoading = createSelector(
  selectNotificationsState,
  (state) => state.loading
);

export const selectNotificationsError = createSelector(
  selectNotificationsState,
  (state) => state.error
);
