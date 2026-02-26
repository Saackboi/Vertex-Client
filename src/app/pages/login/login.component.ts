import { Component, signal, inject, effect, computed } from '@angular/core';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoginDto, RegisterDto } from '../../models';
import { noEmojiValidator } from '../../validators/no-emoji.validator';
import { strongPasswordValidator } from '../../validators/password.validator';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { NavigationUtils } from '../../core/utils/navigation.utils';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule,
    NzIconModule
  ],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(Store);
  private readonly message = inject(NzMessageService);
  private readonly router = inject(Router);

  // 🔥 ESTRICTO: Signals derivadas ÚNICAMENTE del Store
  readonly isLoading = this.store.selectSignal(selectAuthLoading);
  readonly errorMessage = this.store.selectSignal(selectAuthError);
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);

  // Signal local de UI (no viene del Store)
  readonly isLoginMode = signal(true); // true = Login, false = Register

  // Formulario de Login
  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), strongPasswordValidator()]]
  });

  // Formulario de Registro
  readonly registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), noEmojiValidator()]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50), strongPasswordValidator()]]
  });

  constructor() {
    // 🔥 EFFECT: Mostrar notificación de error cuando hay error
    effect(() => {
      const error = this.errorMessage();
      if (error) {
        this.message.error(error, { nzDuration: 5000 });
      }
    });

    // 🔥 EFFECT: Mostrar notificación de éxito SOLO cuando se autentica
    // Debe validar que está autenticado Y no en modo loading
    effect(() => {
      const isAuth = this.isAuthenticated();
      const isLoading = this.isLoading();
      // Solo mostrar si está autenticado y NO está cargando (significa que acaba de terminar)
      if (isAuth && !isLoading) {
        const mode = this.isLoginMode() ? 'Inicio de sesión' : 'Registro';
        this.message.success(`${mode} exitoso. Redirigiendo...`, { nzDuration: 2000 });
      }
    });

    // 🔒 Redirigir automáticamente si ya está autenticado
    effect(() => {
      if (this.isAuthenticated()) {
        NavigationUtils.goToOnboarding(this.router);
      }
    });
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  /**
   * Alterna entre modo Login y Registro
   */
  toggleMode(isLoginMode: boolean): void {
    if (this.isLoginMode() === isLoginMode) return;
    this.isLoginMode.set(isLoginMode);
    this.store.dispatch(AuthActions.clearError());
    this.loginForm.reset();
    this.registerForm.reset();
  }

  /**
   * 🔥 SUBMIT REACTIVO: Despacha acción sin suscribirse
   */
  onLoginSubmit(): void {
    if (!this.loginForm.valid) {
      this.markFormDirty(this.loginForm);
      this.message.warning('Por favor completa todos los campos correctamente');
      return;
    }

    const loginDto: LoginDto = this.loginForm.getRawValue();
    this.store.dispatch(AuthActions.login({ credentials: loginDto }));
  }

  /**
   * 🔥 SUBMIT REACTIVO: Despacha acción sin suscribirse
   */
  onRegisterSubmit(): void {
    if (!this.registerForm.valid) {
      this.markFormDirty(this.registerForm);
      this.message.warning('Por favor completa todos los campos correctamente');
      return;
    }

    const registerDto: RegisterDto = this.registerForm.getRawValue();
    this.store.dispatch(AuthActions.register({ userData: registerDto }));
  }

  /**
   * Marca todos los campos del formulario como dirty para mostrar errores
   */
  private markFormDirty(form: FormGroup): void {
    Object.values(form.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getErrorMessage(formGroup: FormGroup, fieldName: string): string {
    const control = formGroup.get(fieldName);
    if (!control || !control.errors || !control.dirty) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['email']) return 'Ingresa un correo electrónico válido';
    if (control.errors['pattern']) return 'El formato del correo no es válido';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Mínimo ${min} caracteres`;
    }
    if (control.errors['maxlength']) {
      const max = control.errors['maxlength'].requiredLength;
      return `Máximo ${max} caracteres`;
    }
    if (control.errors['strongPassword']) {
      return 'La contraseña debe incluir: mayúscula, minúscula y número';
    }
    if (control.errors['noEmoji']) return 'No se permiten emojis en este campo';
    return 'Campo inválido';
  }

  /**
   * Verifica si un campo tiene error y ha sido tocado
   */
  hasError(formGroup: FormGroup, fieldName: string): boolean {
    const control = formGroup.get(fieldName);
    return !!(control && control.invalid && control.dirty);
  }
}
