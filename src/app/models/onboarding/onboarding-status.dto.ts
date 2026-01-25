import { OnboardingData } from './onboarding-data.model';

/**
 * DTO para estado de onboarding
 */
export interface OnboardingStatusDto {
  currentStep: number;
  isCompleted: boolean;
  updatedAt: string;
  data: OnboardingData;
}
