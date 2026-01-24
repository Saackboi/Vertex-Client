import { Component, signal, inject, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { LoginDto, RegisterDto } from '../../models/api.types';
import { noEmojiValidator } from '../../validators/no-emoji.validator';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../store/auth/auth.selectors';

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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  // Servicios inyectados
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private readonly message = inject(NzMessageService);

  // Estado con Signals
  readonly isLoginMode = signal(true); // true = Login, false = Register

  // Selectors del store
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Formulario de Login
  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Formulario de Registro
  readonly registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), noEmojiValidator()]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]]
  });

  ngOnInit(): void {
    // Subscribe to store state
    this.store.select(selectAuthLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loading => this.isLoading.set(loading));

    this.store.select(selectAuthError)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(error => {
        this.errorMessage.set(error);
        if (error) {
          this.message.error(error, { nzDuration: 5000 });
        }
      });

    // Mostrar notificación de éxito cuando se autentica
    this.store.select(selectIsAuthenticated)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isAuth => {
        if (isAuth) {
          const mode = this.isLoginMode() ? 'Inicio de sesión' : 'Registro';
          this.message.success(`${mode} exitoso. Redirigiendo...`, { nzDuration: 2000 });
        }
      });
  }

  /**
   * Alterna entre modo Login y Registro
   */
  toggleMode(): void {
    this.isLoginMode.update(mode => !mode);
    this.store.dispatch(AuthActions.clearError());
    this.loginForm.reset();
    this.registerForm.reset();
  }

  /**
   * Maneja el submit del formulario de Login
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
   * Maneja el submit del formulario de Registro
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
