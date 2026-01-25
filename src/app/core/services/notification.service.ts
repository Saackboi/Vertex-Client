import { Injectable, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * Servicio global de notificaciones para la aplicación
 * Encapsula NzMessageService para mantener consistencia en todas las notificaciones
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private message = inject(NzMessageService);

  /**
   * Muestra una notificación de error
   * @param content Mensaje de error a mostrar
   * @param duration Duración en milisegundos (default: 5000)
   */
  showError(content: string, duration: number = 5000): void {
    this.message.error(content, { nzDuration: duration });
  }

  /**
   * Muestra una notificación de éxito
   * @param content Mensaje de éxito a mostrar
   * @param duration Duración en milisegundos (default: 3000)
   */
  showSuccess(content: string, duration: number = 3000): void {
    this.message.success(content, { nzDuration: duration });
  }

  /**
   * Muestra una notificación de advertencia
   * @param content Mensaje de advertencia a mostrar
   * @param duration Duración en milisegundos (default: 4000)
   */
  showWarning(content: string, duration: number = 4000): void {
    this.message.warning(content, { nzDuration: duration });
  }

  /**
   * Muestra una notificación informativa
   * @param content Mensaje informativo a mostrar
   * @param duration Duración en milisegundos (default: 3000)
   */
  showInfo(content: string, duration: number = 3000): void {
    this.message.info(content, { nzDuration: duration });
  }

  /**
   * Muestra una notificación de carga
   * @param content Mensaje de carga a mostrar
   * @returns ID del mensaje para poder eliminarlo después
   */
  showLoading(content: string): string {
    return this.message.loading(content, { nzDuration: 0 }).messageId;
  }

  /**
   * Elimina una notificación específica por su ID
   * @param messageId ID del mensaje a eliminar
   */
  remove(messageId: string): void {
    this.message.remove(messageId);
  }

  /**
   * Elimina todas las notificaciones activas
   */
  removeAll(): void {
    this.message.remove();
  }
}
