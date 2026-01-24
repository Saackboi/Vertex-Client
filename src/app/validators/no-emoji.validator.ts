import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador para evitar emojis en campos de texto
 * Retorna error si el campo contiene emojis
 */
export function noEmojiValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    // Regex para detectar emojis y símbolos especiales
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2934}\u{2935}\u{3030}\u{303D}\u{3297}\u{3299}\u{FE0F}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F251}]/u;
    
    if (emojiRegex.test(control.value)) {
      return { noEmoji: { value: control.value } };
    }

    return null;
  };
}
