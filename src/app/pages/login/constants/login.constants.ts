/**
 * Constantes para el componente de login/registro
 */

export const LOGIN_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 100,
  EMAIL_PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
} as const;

export const LOGIN_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Inicio de sesión exitoso. Redirigiendo...',
    REGISTER: 'Registro exitoso. Redirigiendo...'
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
    USER_EXISTS: 'Este email ya está registrado',
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet',
    GENERIC: 'Ocurrió un error. Por favor, intenta de nuevo'
  },
  VALIDATION: {
    REQUIRED: 'Este campo es obligatorio',
    INVALID_EMAIL: 'Email inválido',
    MIN_PASSWORD: 'La contraseña debe tener al menos 6 caracteres',
    STRONG_PASSWORD: 'La contraseña debe incluir: mayúscula, minúscula y número',
    MIN_NAME: 'El nombre debe tener al menos 3 caracteres',
    NO_EMOJI: 'No se permiten emojis en este campo',
    FILL_ALL_FIELDS: 'Por favor completa todos los campos correctamente'
  }
} as const;

export const UI_LABELS = {
  LOGIN_MODE: 'Iniciar Sesión',
  REGISTER_MODE: 'Crear Cuenta',
  SWITCH_TO_REGISTER: '¿No tienes cuenta? Regístrate',
  SWITCH_TO_LOGIN: '¿Ya tienes cuenta? Inicia sesión'
} as const;
