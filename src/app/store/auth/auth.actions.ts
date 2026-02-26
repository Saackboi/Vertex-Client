import { createAction, props } from '@ngrx/store';
import { LoginDto, RegisterDto, UserInfo } from '../../models';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginDto }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: UserInfo; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const restoreSession = createAction(
  '[Auth] Restore Session',
  props<{ user: UserInfo; token: string }>()
);

// Register Actions
export const register = createAction(
  '[Auth] Register',
  props<{ userData: RegisterDto }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: UserInfo; token: string }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Load User Info
export const loadUserInfo = createAction('[Auth] Load User Info');

export const loadUserInfoSuccess = createAction(
  '[Auth] Load User Info Success',
  props<{ user: UserInfo }>()
);

export const loadUserInfoFailure = createAction(
  '[Auth] Load User Info Failure',
  props<{ error: string }>()
);

// Clear Error
export const clearError = createAction('[Auth] Clear Error');
