import { FormGroup } from '@angular/forms';

/**
 * Utilidades para validación de formularios de login
 */
export class LoginFormUtils {
  /**
   * Marca todos los controles como tocados para mostrar errores
   */
  static markFormDirty(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  /**
   * Valida un email con regex
   */
  static isValidEmail(email: string): boolean {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  }

  /**
   * Obtiene el mensaje de error apropiado para un campo
   */
  static getErrorMessage(formGroup: FormGroup, fieldName: string): string {
    const control = formGroup.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['email']) return 'Email inválido';
    if (errors['pattern']) return 'Formato de email inválido';
    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    }
    if (errors['noEmoji']) return 'No se permiten emojis en este campo';

    return 'Campo inválido';
  }

  /**
   * Verifica si un campo tiene errores
   */
  static hasError(formGroup: FormGroup, fieldName: string): boolean {
    const control = formGroup.get(fieldName);
    return !!(control && control.errors && control.touched);
  }
}
