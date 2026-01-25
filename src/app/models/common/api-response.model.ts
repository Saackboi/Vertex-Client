/**
 * Modelo genérico para respuestas de API
 */
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: string[];
}
