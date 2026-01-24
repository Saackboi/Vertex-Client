/**
 * DTOs y interfaces para la API de VERTEX
 * Basado en API_CONTEXT_COMPLETE.md
 */

// ========== API Response Wrapper ==========
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: string[];
}

// ========== Auth DTOs ==========
export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  email: string;
  fullName: string;
  expiresAt: string;
}

// ========== Onboarding DTOs ==========
export interface SaveProgressDto {
  currentStep: number;
  isCompleted: boolean;
  data: OnboardingData;
}

export interface OnboardingStatusDto {
  currentStep: number;
  isCompleted: boolean;
  updatedAt: string;
  data: OnboardingData;
}

export interface OnboardingData {
  fullName?: string;
  email?: string;
  summary?: string;
  skills?: string[];
  experiences?: WorkEntry[];
  educations?: EducationEntry[];
}

export interface WorkEntry {
  company: string;
  role: string;
  description?: string;
  dateRange: {
    start: string;
    end: string | null;
  };
}

export interface EducationEntry {
  institution: string;
  degree: string;
  dateRange: {
    start: string;
    end: string | null;
  };
}

// ========== Professional Profile DTOs ==========
export interface ProfessionalProfileDto {
  id: string;
  userId: string;
  summary: string;
  skills: ProfileSkillDto[];
  experiences: WorkExperienceDto[];
  educations: EducationDto[];
}

export interface ProfileSkillDto {
  id: string;
  name: string;
  level: string;
}

export interface WorkExperienceDto {
  id: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export interface EducationDto {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string | null;
}

// ========== User Info (para almacenamiento local) ==========
export interface UserInfo {
  email: string;
  fullName: string;
  token: string;
  expiresAt: string;
}
