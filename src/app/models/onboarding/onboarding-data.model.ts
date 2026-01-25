import { WorkEntry } from './work-entry.model';
import { EducationEntry } from './education-entry.model';

/**
 * Modelo de datos de onboarding
 */
export interface OnboardingData {
  fullName?: string;
  email?: string;
  summary?: string;
  skills?: string[];
  experiences?: WorkEntry[];
  educations?: EducationEntry[];
}
