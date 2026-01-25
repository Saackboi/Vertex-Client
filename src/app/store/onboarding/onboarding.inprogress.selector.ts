import { createSelector } from '@ngrx/store';
import { selectOnboardingState } from './onboarding.selectors';

export const selectOnboardingInProgress = createSelector(
  selectOnboardingState,
  (state) => {
    if (!state.data) return false;
    return Boolean(
      !state.isCompleted && !!state.data.data && (
        (state.data.data.skills && state.data.data.skills.length > 0) ||
        (state.data.data.experiences && state.data.data.experiences.length > 0) ||
        (state.data.data.educations && state.data.data.educations.length > 0) ||
        (state.data.data.summary && state.data.data.summary.length > 0)
      )
    );
  }
);
