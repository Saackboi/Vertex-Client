/**
 * DTO para experiencia laboral del perfil profesional
 */
export interface WorkExperienceDto {
  id: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}
