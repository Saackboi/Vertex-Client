/**
 * Constantes para el componente de onboarding
 */

export const ONBOARDING_CONSTANTS = {
  STEPS: {
    TOTAL: 3,
    ACCOUNT: 0,
    EXPERIENCE: 1,
    REVIEW: 2
  },
  STEP_LABELS: {
    0: 'Cuenta',
    1: 'Experiencia',
    2: 'Revisión'
  },
  MIN_SUMMARY_LENGTH: 10,
  MAX_SUMMARY_LENGTH: 500,
  MAX_SKILL_LENGTH: 30
} as const;

export const FORM_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es obligatorio',
  MIN_LENGTH: (min: number) => `Mínimo ${min} caracteres`,
  MAX_LENGTH: (max: number) => `Máximo ${max} caracteres`,
  INVALID_EMAIL: 'Email inválido',
  NO_EMOJI: 'No se permiten emojis en este campo',
  FILL_REQUIRED_FIELDS: 'Por favor completa todos los campos requeridos',
  SAVE_SUCCESS: 'Progreso guardado automáticamente',
  SAVE_ERROR: 'Error al guardar el progreso'
} as const;

export const UI_TEXT = {
  PAGE_TITLE: 'Configuración de Cuenta',
  COMPLETED_BADGE: 'Completado',
  AUTOSAVE_PREFIX: 'Borrador guardado automáticamente',
  STEP_INDICATOR: (current: number, total: number) => `Paso ${current} de ${total}`
} as const;
