import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, startWith } from 'rxjs/operators';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropdownMenuComponent, NzDropdownDirective } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigationUtils } from '../../core/utils/navigation.utils';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { OnboardingMapper } from './utils/onboarding.mapper';
import { SaveProgressDto } from '../../models';
import { noEmojiValidator } from '../../validators/no-emoji.validator';
import * as OnboardingActions from '../../store/onboarding/onboarding.actions';
import { selectUserFullName, selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { 
  selectCurrentStep, 
  selectOnboardingLoading,
  selectOnboardingSaving,
  selectLastSaved,
  selectOnboardingData,
  selectIsCompleted,
  selectOnboardingError
} from '../../store/onboarding/onboarding.selectors';
import { FormUtils } from './helpers/form.utils';
import { StepNumber } from './types/onboarding.types';
import { selectUnreadCount } from '../../store/notifications/notifications.selectors';
import { AppLogoComponent } from '../../components/app-logo.component';
import { AppFooterComponent } from '../../components/app-footer.component';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzIconModule,
    NzButtonModule,
    NzBadgeModule,
    NzAvatarModule,
    NzDropdownMenuComponent,
    NzDropdownDirective,
    NzMenuModule,
    NzAlertModule,
    NzModalModule,
    AppLogoComponent,
    AppFooterComponent
  ],
  providers: [],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})
export class OnboardingComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly destroy$ = new Subject<void>();

  // Observables del Store (para usar con async pipe)
  readonly currentStep$: Observable<number> = this.store.select(selectCurrentStep);
  readonly loading$: Observable<boolean> = this.store.select(selectOnboardingLoading);
  readonly saving$: Observable<boolean> = this.store.select(selectOnboardingSaving);
  readonly isCompleted$: Observable<boolean> = this.store.select(selectIsCompleted);
  readonly errorMessage$: Observable<string | null> = this.store.select(selectOnboardingError);
  readonly onboardingData$: Observable<any> = this.store.select(selectOnboardingData);
  readonly userFullName$: Observable<string> = this.store.select(selectUserFullName);
  readonly notificationCount$: Observable<number> = this.store.select(selectUnreadCount).pipe(
    map(count => count ?? 0),
    startWith(0)
  );
  
  readonly isLoading$: Observable<boolean> = this.store.select(selectOnboardingLoading);

  readonly lastSaved$: Observable<string> = this.store.select(selectLastSaved).pipe(
    map(saved => {
      if (!saved) return '';
      const date = new Date(saved);
      return date.toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    })
  );

  // Estado local
  isDarkMode = false;
  skills: string[] = [];
  resumeData: any = {};

  // Formularios
  accountForm!: FormGroup;
  experienceForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForms();
    this.subscribeToStoreUpdates();
    this.store.select(selectIsAuthenticated).pipe(takeUntil(this.destroy$)).subscribe(isAuth => {
      if (isAuth) {
        this.store.dispatch(OnboardingActions.loadResume());
      } else {
        NavigationUtils.goToLogin(this.router);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    // Inicializar formularios
    this.accountForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), noEmojiValidator()]],
      summary: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500), noEmojiValidator()]]
    });

    this.experienceForm = this.fb.group({
      experiences: this.fb.array([])
    });
  }

  private subscribeToStoreUpdates(): void {
    // Cargar nombre SIEMPRE desde el usuario autenticado
    this.userFullName$
      .pipe(takeUntil(this.destroy$))
      .subscribe(fullName => {
        if (fullName) {
          this.accountForm.patchValue({ fullName }, { emitEvent: false });
        }
      });

    this.onboardingData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stateData => {
        const flat = stateData && (stateData as any).data ? (stateData as any).data : (stateData || {});
        
        if (!flat || Object.keys(flat).length === 0) {
          this.resumeData = {};
          return;
        }

        const hydrated = OnboardingMapper.toFormData(flat);
        
        // Patch formulario base (solo summary, el fullName viene del auth store)
        this.accountForm.patchValue({
          summary: hydrated.summary || ''
        }, { emitEvent: false });

        // Reconstruir FormArray de experiencias
        this.rebuildFormArrays(hydrated);

        // Actualizar skills
      if (Array.isArray(hydrated.skills)) {
        this.skills = hydrated.skills;
      }

      this.resumeData = hydrated;
    });

    // Mostrar mensajes de error
    this.errorMessage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.message.error(error, { nzDuration: 5000 });
        }
      });
  }

  /**
   * Reconstruye el FormArray de experiencias desde datos hidratados
   */
  private rebuildFormArrays(formData: any): void {
    // Limpiar experiencias existentes
    while (this.experiences.length > 0) {
      this.experiences.removeAt(0);
    }

    if (Array.isArray(formData.experiences)) {
      formData.experiences.forEach((exp: any, index: number) => {
        const expGroup = this.fb.group({
          jobTitle: [exp.jobTitle || '', [Validators.required, Validators.minLength(3), noEmojiValidator()]],
          company: [exp.company || '', [Validators.required, Validators.minLength(2), noEmojiValidator()]],
          startDate: [exp.startDate || null, [Validators.required]],
          endDate: [exp.endDate || null],
          isCurrent: [!!exp.isCurrent],
          description: [exp.description || '', [Validators.required, Validators.minLength(20), Validators.maxLength(500), noEmojiValidator()]]
        });
        
        this.configureEndDateControl(expGroup);
        if (exp.isCurrent) {
          expGroup.get('endDate')?.disable({ emitEvent: false });
        }
        this.experiences.push(expGroup);
      });
    }
  }

  get experiences(): FormArray {
    return this.experienceForm.get('experiences') as FormArray;
  }

  get canFinishOnboarding(): boolean {
    const data = this.resumeData;
    const hasIdentity = !!data.fullName;
    const hasExperiences = Array.isArray(data.experiences) && data.experiences.length > 0;
    const hasSkills = Array.isArray(data.skills) && data.skills.length > 0;
    const hasContent = hasExperiences || hasSkills;
    return hasIdentity && hasContent;
  }

  getCurrentForm(currentStep: number): FormGroup {
    return currentStep === 0 ? this.accountForm : this.experienceForm;
  }

  addExperience(): void {
    const experienceGroup = this.fb.group({
      jobTitle: ['', [Validators.required, Validators.minLength(3), noEmojiValidator()]],
      company: ['', [Validators.required, Validators.minLength(2), noEmojiValidator()]],
      startDate: ['', [Validators.required]],
      endDate: [''],
      isCurrent: [false],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500), noEmojiValidator()]]
    });

    this.configureEndDateControl(experienceGroup);
    this.experiences.push(experienceGroup);
    this.message.success('¡Experiencia agregada!');
  }

  private configureEndDateControl(group: FormGroup): void {
    const isCurrentControl = group.get('isCurrent');
    const endDateControl = group.get('endDate');
    if (!isCurrentControl || !endDateControl) return;

    if (isCurrentControl.value) {
      endDateControl.disable({ emitEvent: false });
    }

    isCurrentControl.valueChanges.subscribe(isCurrent => {
      if (isCurrent) {
        endDateControl.disable({ emitEvent: false });
        endDateControl.setValue(null);
      } else {
        endDateControl.enable({ emitEvent: false });
      }
    });
  }

  addSkill(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const skill = input.value.trim();
    
    if (event.key === 'Enter' && skill) {
      if (skill.length < 2) {
        this.message.warning('La habilidad debe tener al menos 2 caracteres');
        event.preventDefault();
        return;
      }
      if (this.skills.includes(skill)) {
        this.message.warning('Esta habilidad ya fue agregada');
        event.preventDefault();
        return;
      }
      if (this.skills.length >= 20) {
        this.message.warning('Máximo 20 habilidades permitidas');
        event.preventDefault();
        return;
      }
      this.skills = [...this.skills, skill];
      input.value = '';
      this.message.success(`¡Habilidad "${skill}" agregada!`);
      event.preventDefault();
    }
  }

  removeSkill(skill: string): void {
    this.skills = this.skills.filter(s => s !== skill);
  }

  removeExperience(index: number): void {
    if (index >= 0 && index < this.experiences.length) {
      this.experiences.removeAt(index);
      this.message.success('Experiencia eliminada');
    }
  }

  /**
   * 🔥 NAVEGACIÓN REACTIVA: Despacha acción con payload limpio
   * Delega toda la transformación al Mapper (SoC)
   * IMPORTANTE: Backend espera currentStep 1-indexed (1, 2, 3)
   */
  private async handleNavigation(direction: 'next' | 'back'): Promise<void> {
    try {
      // eslint-disable-next-line no-console
      console.log('[Onboarding] handleNavigation - direction:', direction);
      
      // Obtener currentStep del observable
      const currentFrontendStep = await new Promise<number>(resolve => {
        this.currentStep$.pipe(takeUntil(this.destroy$)).subscribe(s => resolve(s));
      });
      
      // Frontend usa 0-indexed (0, 1, 2), Backend usa 1-indexed (1, 2, 3)
      const targetFrontendStep = direction === 'next' 
        ? Math.min(currentFrontendStep + 1, 2)  // Max step 2 (0-indexed)
        : Math.max(currentFrontendStep - 1, 0);  // Min step 0 (0-indexed)
      
      const targetBackendStep = targetFrontendStep + 1; // Convertir a 1-indexed para backend

      const formData = this.accountForm.getRawValue();

      // ✅ Toda la transformación se hace en el Mapper
      const dto: SaveProgressDto = OnboardingMapper.toSaveDto(
        formData,
        this.experiences.controls,
        this.skills,
        targetBackendStep  // Enviar 1, 2, o 3 al backend
      );

      // Añadir isCompleted si es el último paso (paso 3 en backend = índice 2 frontend)
      dto.isCompleted = (targetFrontendStep === 2);

      this.store.dispatch(OnboardingActions.saveProgress({ dto }));
    } catch (error) {
      this.message.error('Error al navegar: ' + (error as Error).message);
    }
  }

  previousStep(): void {
    this.handleNavigation('back');
  }

  async saveAndContinue(): Promise<void> {
    const currentStep = await new Promise<number>(resolve => {
      this.currentStep$.pipe(takeUntil(this.destroy$)).subscribe(s => resolve(s));
    });
    
    const currentForm = this.getCurrentForm(currentStep);
    if (currentForm.invalid) {
      FormUtils.markFormDirty(currentForm);
      this.message.warning('Por favor completa todos los campos requeridos correctamente');
      return;
    }

    // Validaciones por step
    if (currentStep === 0) {
      const summary = this.accountForm.get('summary')?.value || '';
      if (summary.length < 50) {
        this.message.warning('El resumen profesional debe tener al menos 50 caracteres');
        return;
      }
    }

    if (currentStep === 1) {
      if (this.experiences.length === 0) {
        this.message.warning('Agrega al menos una experiencia laboral');
        return;
      }
      if (this.skills.length === 0) {
        this.message.warning('Agrega al menos una habilidad');
        return;
      }
    }

    this.handleNavigation('next');
  }

  finishOnboarding(): void {
    this.modal.success({
      nzTitle: '¡Perfil Completado!',
      nzContent: '¡Felicitaciones! Has completado tu perfil profesional exitosamente. Ahora puedes explorar nuevas oportunidades.',
      nzOkText: 'Ir al Dashboard',
      nzCentered: true,
      nzOnOk: () => {
        this.store.dispatch(OnboardingActions.completeOnboarding());
      }
    });
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark');
  }

  navigateToNotifications(): void {
    NavigationUtils.goToNotifications(this.router);
  }

  navigateToDashboard(): void {
    NavigationUtils.goToDashboard(this.router);
  }

  logout(): void {
    NavigationUtils.logout(this.router, this.store);
  }

  clearError(): void {
    this.store.dispatch(OnboardingActions.clearError());
  }

  getErrorMessage(formGroup: FormGroup, fieldName: string): string {
    const control = formGroup.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Mínimo ${min} caracteres`;
    }
    if (control.errors['maxlength']) {
      const max = control.errors['maxlength'].requiredLength;
      return `Máximo ${max} caracteres`;
    }
    if (control.errors['noEmoji']) {
      return 'No se permiten emojis en este campo';
    }
    return 'Campo inválido';
  }

  hasError(formGroup: FormGroup, fieldName: string): boolean {
    const control = formGroup.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  hasExperienceError(index: number, fieldName: string): boolean {
    const control = this.experiences.at(index).get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getExperienceErrorMessage(index: number, fieldName: string): string {
    const control = this.experiences.at(index).get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'Requerido';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Mín. ${min} caracteres`;
    }
    if (control.errors['maxlength']) {
      const max = control.errors['maxlength'].requiredLength;
      return `Máx. ${max} caracteres`;
    }
    return 'Inválido';
  }
}
