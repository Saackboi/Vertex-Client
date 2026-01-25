/**
 * Tipos auxiliares para el componente de onboarding
 */

export type StepNumber = 0 | 1 | 2;

export interface FormExperience {
  jobTitle: string;
  company: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
}

export interface FormEducation {
  institution: string;
  degree: string;
  startDate: string | null;
  graduationDate: string | null;
}
