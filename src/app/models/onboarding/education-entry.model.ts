/**
 * Modelo de entrada de educación
 */
export interface EducationEntry {
  institution: string;
  degree: string;
  startDate: string;
  graduationDate: string | null;
}
