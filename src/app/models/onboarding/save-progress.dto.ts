import { OnboardingData } from './onboarding-data.model';

/**
 * DTO para guardar progreso de onboarding
 */
export interface SaveProgressDto {
  currentStep: number;
  isCompleted: boolean;
  data: OnboardingData;
}
