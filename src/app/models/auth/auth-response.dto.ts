/**
 * DTO para respuesta de autenticación
 */
export interface AuthResponseDto {
  token: string;
  email: string;
  fullName: string;
  expiresAt: string;
}
