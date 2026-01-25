import { createAction, props } from '@ngrx/store';
import { OnboardingStatusDto, SaveProgressDto, ProfessionalProfileDto } from '../../models';

// Load Resume
export const loadResume = createAction('[Onboarding] Load Resume');

export const loadResumeSuccess = createAction(
  '[Onboarding] Load Resume Success',
  props<{ data: OnboardingStatusDto }>()
);

export const loadResumeFailure = createAction(
  '[Onboarding] Load Resume Failure',
  props<{ error: string }>()
);

// Save Progress
export const saveProgress = createAction(
  '[Onboarding] Save Progress',
  props<{ dto: SaveProgressDto }>()
);

export const saveProgressSuccess = createAction(
  '[Onboarding] Save Progress Success',
  props<{ data: OnboardingStatusDto }>()
);

export const saveProgressFailure = createAction(
  '[Onboarding] Save Progress Failure',
  props<{ error: string }>()
);

// Complete Onboarding
export const completeOnboarding = createAction('[Onboarding] Complete');

export const completeOnboardingSuccess = createAction(
  '[Onboarding] Complete Success',
  props<{ profile: ProfessionalProfileDto }>()
);

export const completeOnboardingFailure = createAction(
  '[Onboarding] Complete Failure',
  props<{ error: string }>()
);

// Update Current Step
export const updateCurrentStep = createAction(
  '[Onboarding] Update Current Step',
  props<{ step: number }>()
);

// Clear Error
export const clearError = createAction('[Onboarding] Clear Error');

// Reset State
export const resetOnboarding = createAction('[Onboarding] Reset');
