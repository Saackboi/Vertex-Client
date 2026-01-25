import { ProfileSkillDto } from './profile-skill.dto';
import { WorkExperienceDto } from './work-experience.dto';
import { EducationDto } from './education.dto';

/**
 * DTO para perfil profesional completo
 */
export interface ProfessionalProfileDto {
  id: string;
  userId: string;
  summary: string;
  skills: ProfileSkillDto[];
  experiences: WorkExperienceDto[];
  educations: EducationDto[];
}
