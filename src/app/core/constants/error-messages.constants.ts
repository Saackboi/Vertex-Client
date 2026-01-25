/**
 * Mensajes de error centralizados para toda la aplicación
 */

export const ERROR_MESSAGES = {
  // Errores de red y conexión
  NETWORK: {
    NO_CONNECTION: 'No hay conexión con el servidor. Verifica tu conexión a internet.',
    TIMEOUT: 'La solicitud tardó demasiado. Intenta de nuevo.',
    UNKNOWN: 'Error de red. Por favor, intenta de nuevo.'
  },

  // Errores de autenticación (401)
  AUTH: {
    INVALID_CREDENTIALS: 'Email o contraseña incorrectos.',
    UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
    SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    TOKEN_INVALID: 'Token de autenticación inválido.'
  },

  // Errores de validación (400)
  VALIDATION: {
    INVALID_DATA: 'Los datos ingresados no son válidos. Verifica e intenta de nuevo.',
    MISSING_FIELDS: 'Faltan campos requeridos.',
    INVALID_FORMAT: 'El formato de los datos no es correcto.',
    INVALID_EMAIL: 'El formato del email no es válido.',
    INVALID_PASSWORD: 'La contraseña no cumple con los requisitos.',
    PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres.',
    PASSWORD_WEAK: 'La contraseña debe incluir mayúscula, minúscula y número.'
  },

  // Errores de recursos (404)
  NOT_FOUND: {
    RESOURCE: 'El recurso solicitado no fue encontrado.',
    USER: 'Usuario no encontrado.',
    ONBOARDING: 'No se encontró información de onboarding.'
  },

  // Errores de conflicto (409)
  CONFLICT: {
    USER_EXISTS: 'Este email ya está registrado. Intenta con otro o inicia sesión.',
    DUPLICATE_ENTRY: 'Ya existe un registro con estos datos.'
  },

  // Errores del servidor (500)
  SERVER: {
    INTERNAL_ERROR: 'Error interno del servidor. Intenta más tarde.',
    SERVICE_UNAVAILABLE: 'El servicio no está disponible temporalmente.',
    DATABASE_ERROR: 'Error al procesar la información. Intenta más tarde.',
    DATABASE_CONNECTION: 'No se pudo conectar con la base de datos. Estamos trabajando para resolverlo.',
    BACKEND_UNAVAILABLE: 'El servidor no está disponible en este momento. Por favor, intenta más tarde.'
  },

  // Errores de negocio
  BUSINESS: {
    ONBOARDING_NOT_COMPLETE: 'Debes completar el proceso de onboarding.',
    INVALID_STEP: 'Paso de onboarding inválido.',
    CANNOT_SAVE_PROGRESS: 'No se pudo guardar el progreso. Intenta de nuevo.'
  },

  // Errores genéricos
  GENERIC: {
    UNKNOWN: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
    TRY_AGAIN: 'Por favor, intenta de nuevo en unos momentos.',
    CONTACT_SUPPORT: 'Si el problema persiste, contacta con soporte.'
  }
} as const;

/**
 * Códigos de estado HTTP
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;
