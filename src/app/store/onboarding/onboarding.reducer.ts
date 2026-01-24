import { createReducer, on } from '@ngrx/store';
import { OnboardingStatusDto } from '../../models/api.types';
import * as OnboardingActions from './onboarding.actions';

export interface OnboardingState {
  currentStep: number;
  data: OnboardingStatusDto | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  isCompleted: boolean;
  lastSaved: string | null;
}

export const initialState: OnboardingState = {
  currentStep: 0,
  data: null,
  loading: false,
  saving: false,
  error: null,
  isCompleted: false,
  lastSaved: null
};

export const onboardingReducer = createReducer(
  initialState,

  // Load Resume
  on(OnboardingActions.loadResume, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(OnboardingActions.loadResumeSuccess, (state, { data }) => ({
    ...state,
    data,
    currentStep: Math.min(data.currentStep, 2),
    isCompleted: data.isCompleted,
    lastSaved: data.updatedAt,
    loading: false,
    error: null
  })),

  on(OnboardingActions.loadResumeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isCompleted: false,
    currentStep: 0,
    error
  })),

  // Save Progress
  on(OnboardingActions.saveProgress, (state) => ({
    ...state,
    saving: true,
    error: null
  })),

  on(OnboardingActions.saveProgressSuccess, (state, { data }) => ({
    ...state,
    data,
    currentStep: Math.min(data.currentStep, 2),
    lastSaved: data.updatedAt,
    saving: false,
    error: null
  })),

  on(OnboardingActions.saveProgressFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error
  })),

  // Complete Onboarding
  on(OnboardingActions.completeOnboarding, (state) => ({
    ...state,
    saving: true,
    error: null
  })),

  on(OnboardingActions.completeOnboardingSuccess, (state) => ({
    ...state,
    isCompleted: true,
    saving: false,
    error: null
  })),

  on(OnboardingActions.completeOnboardingFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error
  })),

  // Update Current Step
  on(OnboardingActions.updateCurrentStep, (state, { step }) => ({
    ...state,
    currentStep: Math.min(step, 2)
  })),

  // Clear Error
  on(OnboardingActions.clearError, (state) => ({
    ...state,
    error: null
  })),

  // Reset
  on(OnboardingActions.resetOnboarding, () => initialState)
);
