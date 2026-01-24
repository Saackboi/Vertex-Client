import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OnboardingState } from './onboarding.reducer';

export const selectOnboardingState = createFeatureSelector<OnboardingState>('onboarding');

export const selectCurrentStep = createSelector(
  selectOnboardingState,
  (state) => state.currentStep
);

export const selectOnboardingData = createSelector(
  selectOnboardingState,
  (state) => state.data
);

export const selectOnboardingLoading = createSelector(
  selectOnboardingState,
  (state) => state.loading
);

export const selectOnboardingSaving = createSelector(
  selectOnboardingState,
  (state) => state.saving
);

export const selectOnboardingError = createSelector(
  selectOnboardingState,
  (state) => state.error
);

export const selectIsCompleted = createSelector(
  selectOnboardingState,
  (state) => state.isCompleted
);

export const selectLastSaved = createSelector(
  selectOnboardingState,
  (state) => state.lastSaved
);

export const selectFormData = createSelector(
  selectOnboardingData,
  (data) => data?.data
);

export const selectExperiences = createSelector(
  selectFormData,
  (formData) => formData?.experiences || []
);

export const selectSkills = createSelector(
  selectFormData,
  (formData) => formData?.skills || []
);
