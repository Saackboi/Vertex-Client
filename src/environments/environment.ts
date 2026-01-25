/**
 * Configuración de entorno para desarrollo
 * 
 * Estos valores deben coincidir con el API backend de VERTEX
 * Ver: API_CONTEXT_COMPLETE.md
 */
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7216/api',
  signalRUrl: 'https://localhost:7216/hubs/notifications',
  tokenKey: 'authToken',
  userKey: 'userInfo',
  enableSignalR: true // Cambiar a false para desactivar SignalR temporalmente
};
