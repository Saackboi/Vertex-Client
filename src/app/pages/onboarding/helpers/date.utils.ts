/**
 * Utilidades para manejo de fechas en onboarding
 */
export class DateUtils {
  /**
   * Convierte una fecha Date a formato ISO string
   */
  static toIsoString(date: Date | string | null): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return date.toISOString();
  }

  /**
   * Convierte Date a formato YYYY-MM para inputs type="month"
   * Retorna null si la fecha es inválida o es la fecha mínima de C# (0001-01-01)
   * Usa métodos UTC para evitar problemas de zona horaria
   */
  static toMonthFormat(d: Date | null | undefined): string | null {
    if (!d) return null;
    if (!(d instanceof Date)) return null;

    const year = d.getUTCFullYear();
    // Detectar fecha mínima de C# DateTime (0001-01-01)
    if (year < 1900) {
      console.warn('[DateUtils] Fecha mínima detectada, ignorando:', d);
      return null;
    }

    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Convierte formato "YYYY-MM" a ISO string completo
   */
  static monthFormatToIso(monthStr: string | null): string {
    if (!monthStr) return '';
    return `${monthStr}-01T00:00:00.000Z`;
  }

  /**
   * Formatea una fecha para mostrar en la UI
   */
  static formatDisplayDate(date: string | Date | null): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
