/**
 * DTO para educación del perfil profesional
 */
export interface EducationDto {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string | null;
}
