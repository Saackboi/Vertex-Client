/**
 * Modelo de entrada de experiencia laboral
 */
export interface WorkEntry {
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
}
