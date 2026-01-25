import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado para contraseñas que cumple con los requisitos del backend:
 * - Mínimo 6 caracteres
 * - Al menos una letra mayúscula (A-Z)
 * - Al menos una letra minúscula (a-z)
 * - Al menos un dígito (0-9)
 * - NO requiere caracteres especiales
 */
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // No validar si está vacío (eso lo maneja 'required')
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const isValidLength = value.length >= 6;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumber && isValidLength;

    if (!passwordValid) {
      return {
        strongPassword: {
          hasUpperCase,
          hasLowerCase,
          hasNumber,
          isValidLength
        }
      };
    }

    return null;
  };
}
