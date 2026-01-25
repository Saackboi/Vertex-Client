/**
 * Configuración de entorno para producción
 * 
 * IMPORTANTE: Actualizar estas URLs con las del servidor de producción
 */
export const environment = {
  production: true,
  apiUrl: 'https://api.vertex.com/api',  // Cambiar por URL real
  signalRUrl: 'https://api.vertex.com/hubs/notifications',  // Cambiar por URL real
  tokenKey: 'authToken',
  userKey: 'userInfo',
  enableSignalR: true // SignalR habilitado en producción
};
