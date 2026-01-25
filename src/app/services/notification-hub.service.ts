import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable, firstValueFrom, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  userId?: string;
}

/**
 * Servicio de SignalR para notificaciones en tiempo real
 * Conecta al hub de notificaciones del backend y escucha eventos
 * 
 * Configuración del Backend (SIGNALR_GUIDE.md):
 * - URL: https://localhost:7216/hubs/notifications
 * - Autenticación: JWT Token vía accessTokenFactory
 * - Transporte: WebSockets
 * - Requiere [Authorize] - solo usuarios autenticados
 * 
 * Eventos del servidor:
 * - OnboardingProgress: Progreso del onboarding
 * - OnboardingCompleted: Onboarding completado
 * - Notification: Notificación general
 * - GroupNotification: Notificación a grupo
 * - Pong: Respuesta a Ping (testing)
 * 
 * Métodos invocables:
 * - Ping(): Test de conexión
 * - JoinGroup(groupName): Unirse a un grupo
 * - LeaveGroup(groupName): Salir de un grupo
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationHubService {
  private hubConnection: signalR.HubConnection | null = null;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private connectionStateSubject = new BehaviorSubject<boolean>(false);
  private http = inject(HttpClient);

  readonly notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();
  readonly isConnected$: Observable<boolean> = this.connectionStateSubject.asObservable();

  /**
   * Inicia la conexión con el hub de SignalR
   * @param token Token JWT para autenticación
   */
  async startConnection(token: string): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR ya está conectado');
      return;
    }

    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(environment.signalRUrl, {
          accessTokenFactory: () => token,
          skipNegotiation: false, // Permitir negociación según guía del backend
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Reintentos progresivos
        .configureLogging(signalR.LogLevel.Warning) // Solo warnings y errores
        .build();

      // Configurar manejadores de reconexión
      this.hubConnection.onreconnecting((error) => {
        if (!environment.production) {
          console.log('[SignalR] Reconectando...', error?.message || '');
        }
        this.connectionStateSubject.next(false);
      });

      this.hubConnection.onreconnected((connectionId) => {
        if (!environment.production) {
          console.log('[SignalR] ✓ Reconectado:', connectionId);
        }
        this.connectionStateSubject.next(true);
        this.requestHistory(); // Recargar notificaciones
      });

      this.hubConnection.onclose((error) => {
        if (!environment.production && error) {
          console.warn('[SignalR] Conexión cerrada:', error.message);
        }
        this.connectionStateSubject.next(false);
      });

      // Configurar listeners antes de conectar
      this.setupListeners();

      await this.hubConnection.start();
      if (!environment.production) {
        console.log('[SignalR] ✓ Conectado');
      }
      this.connectionStateSubject.next(true);

      // Solicitar notificaciones históricas al conectar
      await this.requestHistory();
    } catch (error: any) {
      // Solo mostrar advertencia en desarrollo, no error crítico
      if (!environment.production) {
        console.warn('[SignalR] ⚠ Backend no disponible. Las notificaciones en tiempo real estarán desactivadas.');
        console.debug('[SignalR] Detalle del error:', error?.message || error);
      }
      this.connectionStateSubject.next(false);
      // NO lanzar el error para no romper la aplicación
      // La app funcionará sin notificaciones en tiempo real
    }
  }

  /**
   * Detiene la conexión con el hub
   */
  async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        if (!environment.production) {
          console.log('[SignalR] Desconectado');
        }
        this.connectionStateSubject.next(false);
        this.notificationsSubject.next([]);
      } catch (error) {
        // Silenciar errores de desconexión
        this.connectionStateSubject.next(false);
      }
    }
  }

  /**
   * Configura los listeners para eventos del hub
   */
  private setupListeners(): void {
    if (!this.hubConnection) return;

    // ====== Eventos según SIGNALR_GUIDE.md ======
    
    // 1. OnboardingProgress: Progreso del onboarding
    this.hubConnection.on('OnboardingProgress', (notification: Notification) => {
      if (!environment.production) {
        console.log('[SignalR] OnboardingProgress:', notification);
      }
      const current = this.notificationsSubject.value;
      // Buscar si ya existe una notificación con el mismo ID (upsert)
      const exists = current.some(n => n.id === notification.id);
      if (exists) {
        // Actualizar la existente (Backend usa patrón upsert)
        const updated = current.map(n => n.id === notification.id ? notification : n);
        this.notificationsSubject.next(updated);
      } else {
        // Añadir como nueva
        this.notificationsSubject.next([notification, ...current]);
      }
    });

    // 2. OnboardingCompleted: Finalización del onboarding
    this.hubConnection.on('OnboardingCompleted', (notification: Notification) => {
      if (!environment.production) {
        console.log('[SignalR] OnboardingCompleted:', notification);
      }
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...current]);
    });

    // 3. Notification: Notificación general
    this.hubConnection.on('Notification', (notification: Notification) => {
      if (!environment.production) {
        console.log('[SignalR] Notification:', notification);
      }
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...current]);
    });

    // 4. GroupNotification: Notificación a grupo
    this.hubConnection.on('GroupNotification', (notification: Notification) => {
      if (!environment.production) {
        console.log('[SignalR] GroupNotification:', notification);
      }
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...current]);
    });

    // 5. Pong: Respuesta a Ping (para testing)
    this.hubConnection.on('Pong', (timestamp: string) => {
      if (!environment.production) {
        console.log('[SignalR] Pong recibido:', timestamp);
      }
    });

    // ====== Eventos legacy (mantener por compatibilidad) ======
    
    // Recibir nueva notificación (formato antiguo)
    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      if (!environment.production) {
        console.log('[SignalR] ReceiveNotification (legacy):', notification);
      }
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...current]);
    });

    // Recibir historial de notificaciones
    this.hubConnection.on('NotificationHistory', (notifications: Notification[]) => {
      if (!environment.production) {
        console.log(`[SignalR] NotificationHistory: ${notifications.length} notificaciones`);
      }
      this.notificationsSubject.next(notifications);
    });

    // Notificación marcada como leída
    this.hubConnection.on('NotificationRead', (notificationId: string) => {
      const current = this.notificationsSubject.value;
      const updated = current.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      this.notificationsSubject.next(updated);
    });

    // Todas las notificaciones marcadas como leídas
    this.hubConnection.on('AllNotificationsRead', () => {
      const current = this.notificationsSubject.value;
      const updated = current.map(n => ({ ...n, read: true }));
      this.notificationsSubject.next(updated);
    });
  }

  /**
   * Endpoint REST para obtener historial
   */
  fetchHistory(): Observable<Notification[]> {
    // El backend responde con envoltorio { success, message, data }
    return this.http
      .get<{ data: Notification[] }>(`${environment.apiUrl}/notifications`)
      .pipe(map((resp) => resp?.data ?? []));
  }

  /**
   * Solicita el historial y actualiza el subject interno
   */
  private async requestHistory(): Promise<void> {
    try {
      const notifications = await firstValueFrom(this.fetchHistory());
      this.notificationsSubject.next(notifications ?? []);
    } catch (error) {
      if (!environment.production) {
        console.error('Error al solicitar historial de notificaciones:', error);
      }
      // No lanzar error, simplemente continuar con array vacío
    }
  }

  /**
   * Marca una notificación como leída
   */
  async markAsRead(notificationId: string): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('MarkAsRead', notificationId);
      } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
      }
    }
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('MarkAllAsRead');
        const current = this.notificationsSubject.value;
        const updated = current.map(n => ({ ...n, read: true }));
        this.notificationsSubject.next(updated);
      } catch (error) {
        console.error('Error al marcar todas como leídas:', error);
      }
    }
  }

  /**
   * Obtiene el estado actual de las notificaciones
   */
  getCurrentNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  /**
   * Obtiene el estado de conexión actual
   */
  isConnected(): boolean {
    return this.connectionStateSubject.value;
  }

  /**
   * Método de prueba: envía un Ping al servidor
   * @returns Promise que se resuelve cuando el servidor responde con Pong
   */
  async ping(): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('Ping');
        if (!environment.production) {
          console.log('[SignalR] Ping enviado');
        }
      } catch (error) {
        console.error('[SignalR] Error al enviar Ping:', error);
      }
    }
  }

  /**
   * Une el usuario actual a un grupo específico
   * @param groupName Nombre del grupo al que unirse
   */
  async joinGroup(groupName: string): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('JoinGroup', groupName);
        if (!environment.production) {
          console.log(`[SignalR] Unido al grupo: ${groupName}`);
        }
      } catch (error) {
        console.error(`[SignalR] Error al unirse al grupo ${groupName}:`, error);
      }
    }
  }

  /**
   * Remueve el usuario actual de un grupo específico
   * @param groupName Nombre del grupo del que salir
   */
  async leaveGroup(groupName: string): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke('LeaveGroup', groupName);
        if (!environment.production) {
          console.log(`[SignalR] Salió del grupo: ${groupName}`);
        }
      } catch (error) {
        console.error(`[SignalR] Error al salir del grupo ${groupName}:`, error);
      }
    }
  }

  /**
   * Obtiene el historial de notificaciones desde el backend
   */
  getNotificationHistory(): Observable<Notification[]> {
    return this.notifications$;
  }
}
