import { SaveProgressDto, WorkEntry, OnboardingData } from '../../../models/onboarding';
import { DateUtils } from '../helpers/date.utils';

/**
 * Mapper para transformar datos entre API y formularios de onboarding
 */
export class OnboardingMapper {
  /**
   * Hidrata datos del Store/API para el formulario
   */
  static toFormData(input: any): any {
    if (!input) return {};

    // eslint-disable-next-line no-console
    console.log('[Mapper] toFormData - INPUT:', input);

    let parsed = input;
    // 1. Detección de tipo: parsear solo si es string
    if (typeof input === 'string') {
      try {
        parsed = JSON.parse(input);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[Mapper] Error parsing JSON string:', e);
        return {};
      }
    }

    // 2. Normalización de experiencias (plural/singular)
    const rawExperience = parsed.experience || parsed.experiences || [];
    const experiences = Array.isArray(rawExperience)
      ? rawExperience.map((exp: any) => {
          const startDateObj = exp.startDate ? new Date(exp.startDate) : null;
          const endDateObj = exp.endDate ? new Date(exp.endDate) : null;
          
          return {
            company: exp.company || '',
            // Mapear al nombre del control del formulario: jobTitle
            jobTitle: exp.position || exp.role || exp.jobTitle || '',
            description: exp.description || '',
            startDate: DateUtils.toMonthFormat(startDateObj), // Formato YYYY-MM para input
            endDate: DateUtils.toMonthFormat(endDateObj),     // Formato YYYY-MM para input
            isCurrent: exp.isCurrent ?? !exp.endDate
          };
        })
      : [];

    // 3. Normalización de skills
    const rawSkills = parsed.skills || parsed.jsonSkills || [];
    const skills = Array.isArray(rawSkills) ? rawSkills : [];

    // 4. Retornar estructura lista para patchValue
    const result = {
      ...parsed,
      summary: parsed.summary || '',
      skills,
      // Usar nombre PLURAL consistente con el FormArray en el componente
      experiences
    };

    // eslint-disable-next-line no-console
    console.log('[Mapper] toFormData - OUTPUT:', result);
    // eslint-disable-next-line no-console
    console.log('[Mapper] toFormData - experiences detail:', experiences);
    return result;
  }

  /**
   * Construye un SaveProgressDto completo desde el formulario
   * Maneja toda la transformación de datos (fechas, experiencias, etc.)
   */
  static toSaveDto(accountFormValue: any, experiencesControls: any[], skills: string[], targetStep: number): SaveProgressDto {
    // eslint-disable-next-line no-console
    console.log('[Mapper] toSaveDto - INPUT accountFormValue:', accountFormValue);
    // eslint-disable-next-line no-console
    console.log('[Mapper] toSaveDto - experiencesControls count:', experiencesControls.length);
    
    const experiencesData: WorkEntry[] = experiencesControls.map((control, index) => {
      const val = control.value;
      // eslint-disable-next-line no-console
      console.log(`[Mapper] toSaveDto - Processing experience ${index}:`, val);
      
      // Convertir formato YYYY-MM a ISO string completo
      const startIso = val.startDate ? DateUtils.monthFormatToIso(val.startDate) : '';
      const endIso = val.isCurrent ? null : (val.endDate ? DateUtils.monthFormatToIso(val.endDate) : null);
      
      // eslint-disable-next-line no-console
      console.log(`[Mapper] toSaveDto - exp ${index} dates: startIso=${startIso}, endIso=${endIso}`);
      
      return {
        company: (val.company || '').trim(),
        role: (val.jobTitle || '').trim(),
        description: (val.description || '').trim(),
        startDate: startIso,
        endDate: endIso
      };
    });

    const data: OnboardingData = {
      fullName: (accountFormValue.fullName || '').trim(),
      email: '', // Se obtiene del token en el backend
      summary: (accountFormValue.summary || '').trim(),
      skills,
      experiences: experiencesData,
      educations: []
    };

    const dto: SaveProgressDto = {
      currentStep: targetStep,
      isCompleted: false,
      data
    };

    // eslint-disable-next-line no-console
    console.log('[OnboardingMapper] DTO construido:', JSON.stringify(dto, null, 2));
    return dto;
  }
}
