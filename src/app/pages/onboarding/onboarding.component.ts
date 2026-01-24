import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '../../services/auth.service';
import { SaveProgressDto, OnboardingData as ApiOnboardingData, WorkEntry } from '../../models/api.types';
import { noEmojiValidator } from '../../validators/no-emoji.validator';
import * as OnboardingActions from '../../store/onboarding/onboarding.actions';
import { 
  selectCurrentStep, 
  selectOnboardingLoading, 
  selectOnboardingSaving,
  selectLastSaved,
  selectFormData,
  selectIsCompleted 
} from '../../store/onboarding/onboarding.selectors';

@Component({
  selector: 'app-onboarding',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzIconModule,
    NzButtonModule,
    NzBadgeModule,
    NzAvatarModule,
    NzAlertModule,
    NzModalModule
  ],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})
export class OnboardingComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentStep = signal(0);
  readonly isDarkMode = signal(false);
  readonly lastSaved = signal<string>('');
  readonly notificationCount = signal(3);
  readonly isLoading = signal(false);
  readonly isCompleted = signal(false);
  readonly skills = signal<string[]>([]);
  readonly newSkill = signal<string>('');

  private dataLoaded = false;

  accountForm!: FormGroup;
  experienceForm!: FormGroup;

  ngOnInit(): void {
    // Obtener nombre del usuario desde localStorage
    const userInfo = this.authService.getUserInfo();
    const fullName = userInfo?.fullName || '';

    this.accountForm = this.fb.group({
      fullName: [{ value: fullName, disabled: true }], // Solo lectura, viene del perfil
      jobTitle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), noEmojiValidator()]],
      summary: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500), noEmojiValidator()]]
    });

    this.experienceForm = this.fb.group({
      experiences: this.fb.array([])
    });

    // Cargar datos existentes primero
    this.loadExistingData();

    // Subscribe to store state
    this.store.select(selectCurrentStep).subscribe(step => this.currentStep.set(step));
    this.store.select(selectOnboardingLoading).subscribe(loading => this.isLoading.set(loading));
    this.store.select(selectOnboardingSaving).subscribe(saving => this.isLoading.set(saving));
    this.store.select(selectIsCompleted).subscribe(completed => {
      this.isCompleted.set(completed);
    });
    this.store.select(selectLastSaved).subscribe(saved => {
      if (saved) {
        const date = new Date(saved);
        this.lastSaved.set(date.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }));
      }
    });

    // Auto-save cada 30 segundos
    setInterval(() => {
      const currentForm = this.getCurrentForm();
      if (currentForm && currentForm.dirty && currentForm.valid) {
        this.autoSave();
      }
    }, 30000);
  }

  loadExistingData(): void {
    this.store.dispatch(OnboardingActions.loadResume());
    
    this.store.select(selectFormData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        if (data && !this.dataLoaded) {
          this.dataLoaded = true;
          
          // Rellenar formulario con datos existentes
          this.accountForm.patchValue({
            jobTitle: data.summary || '', // Temporal: ajustar cuando exista jobTitle en API
            summary: data.summary || ''
          });

          // Limpiar experiencias existentes antes de cargar
          while (this.experiences.length > 0) {
            this.experiences.removeAt(0);
          }

          // Cargar experiencias
          if (data.experiences && data.experiences.length > 0) {
            data.experiences.forEach(exp => {
              const expGroup = this.fb.group({
                jobTitle: [exp.role || '', [Validators.required, Validators.minLength(3), noEmojiValidator()]],
                company: [exp.company || '', [Validators.required, Validators.minLength(2), noEmojiValidator()]],
                startDate: [exp.dateRange?.start || '', [Validators.required]],
                endDate: [exp.dateRange?.end || ''],
                isCurrent: [!exp.dateRange?.end || false],
                description: [exp.description || '', [Validators.required, Validators.minLength(20), Validators.maxLength(500), noEmojiValidator()]]
              });
              this.experiences.push(expGroup);
            });
          }

          // Cargar habilidades
          if (data.skills) {
            this.skills.set(data.skills);
          }
        }
      });
  }

  get experiences(): FormArray {
    return this.experienceForm.get('experiences') as FormArray;
  }

  getCurrentForm(): FormGroup {
    return this.currentStep() === 0 ? this.accountForm : this.experienceForm;
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
    this.experiences.push(experienceGroup);
    this.message.success('¡Experiencia agregada!');
  }

  removeExperience(index: number): void {
    this.experiences.removeAt(index);
    this.message.info('Experiencia eliminada');
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
      if (this.skills().includes(skill)) {
        this.message.warning('Esta habilidad ya fue agregada');
        event.preventDefault();
        return;
      }
      if (this.skills().length >= 20) {
        this.message.warning('Máximo 20 habilidades permitidas');
        event.preventDefault();
        return;
      }
      this.skills.update(skills => [...skills, skill]);
      input.value = '';
      this.message.success(`¡Habilidad "${skill}" agregada!`);
      event.preventDefault();
    }
  }

  removeSkill(skill: string): void {
    this.skills.update(skills => skills.filter(s => s !== skill));
  }

  previousStep(): void {
    if (this.currentStep() > 0) {
      // Guardar progreso antes de retroceder para no perder datos
      const currentForm = this.getCurrentForm();
      if (currentForm.dirty) {
        this.autoSave();
      }
      this.store.dispatch(OnboardingActions.updateCurrentStep({ step: this.currentStep() - 1 }));
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(v => !v);
    document.documentElement.classList.toggle('dark');
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  autoSave(): void {
    const currentForm = this.getCurrentForm();
    if (currentForm.invalid) return;

    const userInfo = this.authService.getUserInfo();
    const formData = this.accountForm.getRawValue();
    const experiencesData: WorkEntry[] = this.experiences.controls.map(control => {
      const val = control.value;
      return {
        company: val.company || '',
        role: val.jobTitle || '',
        description: val.description || '',
        dateRange: {
          start: val.startDate || '',
          end: val.isCurrent ? null : (val.endDate || null)
        }
      };
    });

    const dto: SaveProgressDto = {
      currentStep: this.currentStep(),
      isCompleted: false,
      data: {
        fullName: userInfo?.fullName || formData.fullName,
        email: userInfo?.email || '',
        summary: formData.summary || '',
        skills: this.skills(),
        experiences: experiencesData,
        educations: []
      }
    };

    this.store.dispatch(OnboardingActions.saveProgress({ dto }));
  }

  saveAndContinue(): void {
    const currentForm = this.getCurrentForm();
    if (currentForm.invalid) {
      Object.values(currentForm.controls).forEach(control => {
        if (control instanceof FormArray) {
          control.controls.forEach(c => {
            const group = c as FormGroup;
            Object.values(group.controls).forEach((field: AbstractControl) => field.markAsTouched());
          });
        } else {
          control.markAsTouched();
        }
      });
      this.message.warning('Por favor completa todos los campos requeridos correctamente');
      return;
    }

    // Validaciones adicionales por step
    if (this.currentStep() === 0) {
      const summary = this.accountForm.get('summary')?.value || '';
      if (summary.length < 50) {
        this.message.warning('El resumen profesional debe tener al menos 50 caracteres');
        return;
      }
    }

    if (this.currentStep() === 1) {
      if (this.experiences.length === 0) {
        this.message.warning('Agrega al menos una experiencia laboral');
        return;
      }
      if (this.skills().length === 0) {
        this.message.warning('Agrega al menos una habilidad');
        return;
      }
    }

    const userInfo = this.authService.getUserInfo();
    const formData = this.accountForm.getRawValue();
    const experiencesData: WorkEntry[] = this.experiences.controls.map(control => {
      const val = control.value;
      return {
        company: val.company || '',
        role: val.jobTitle || '',
        description: val.description || '',
        dateRange: {
          start: val.startDate || '',
          end: val.isCurrent ? null : (val.endDate || null)
        }
      };
    });

    const dto: SaveProgressDto = {
      currentStep: this.currentStep() + 1,
      isCompleted: false,
      data: {
        fullName: userInfo?.fullName || formData.fullName,
        email: userInfo?.email || '',
        summary: formData.summary || '',
        skills: this.skills(),
        experiences: experiencesData,
        educations: []
      }
    };

    this.store.dispatch(OnboardingActions.saveProgress({ dto }));
    this.message.success('Progreso guardado exitosamente');
    
    // Actualizar el step después de guardar
    if (this.currentStep() < 2) {
      this.store.dispatch(OnboardingActions.updateCurrentStep({ step: this.currentStep() + 1 }));
    }
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

  /**
   * Obtiene el mensaje de error para un campo específico
   */
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

  /**
   * Verifica si un campo tiene error y ha sido tocado
   */
  hasError(formGroup: FormGroup, fieldName: string): boolean {
    const control = formGroup.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Verifica si un control de experiencia tiene error
   */
  hasExperienceError(index: number, fieldName: string): boolean {
    const control = this.experiences.at(index).get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Obtiene mensaje de error para campo de experiencia
   */
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
