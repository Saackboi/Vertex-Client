import { FormGroup } from '@angular/forms';

/**
 * Utilidades para manejo de formularios en onboarding
 */
export class FormUtils {
  /**
   * Marca todos los controles de un formulario como tocados
   */
  static markFormDirty(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control && 'controls' in control) {
        this.markFormDirty(control as FormGroup);
      }
    });
  }

  /**
   * Verifica si un campo tiene errores y ha sido tocado
   */
  static hasError(formGroup: FormGroup, fieldName: string): boolean {
    const control = formGroup.get(fieldName);
    return !!(control && control.errors && control.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  static getErrorMessage(formGroup: FormGroup, fieldName: string): string {
    const control = formGroup.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['email']) return 'Email inválido';
    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    }
    if (errors['noEmoji']) return 'No se permiten emojis en este campo';
    if (errors['pattern']) return 'Formato inválido';

    return 'Campo inválido';
  }

  /**
   * Cuenta caracteres en un campo de texto
   */
  static getCharCount(formGroup: FormGroup, fieldName: string): number {
    return formGroup.get(fieldName)?.value?.length || 0;
  }
}
