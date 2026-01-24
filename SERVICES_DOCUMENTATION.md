# 🔌 Servicios de API - VertexClient

## 📦 Servicios Implementados

### 1. AuthService (`services/auth.service.ts`)

Servicio de autenticación conectado a los endpoints del backend VERTEX.

#### Métodos Públicos:

##### `register(dto: RegisterDto): Observable<AuthResponseDto>`
Registra un nuevo usuario en el sistema.
```typescript
const registerDto: RegisterDto = {
  email: 'usuario@example.com',
  password: 'Password123',
  fullName: 'Juan Pérez'
};

this.authService.register(registerDto).subscribe({
  next: (response) => {
    console.log('Usuario registrado:', response);
    this.router.navigate(['/onboarding']);
  },
  error: (error) => {
    console.error('Error en registro:', error.message);
  }
});
```

##### `login(dto: LoginDto): Observable<AuthResponseDto>`
Inicia sesión en el sistema.
```typescript
const loginDto: LoginDto = {
  email: 'usuario@example.com',
  password: 'Password123'
};

this.authService.login(loginDto).subscribe({
  next: (response) => {
    console.log('Login exitoso:', response);
    this.router.navigate(['/onboarding']);
  },
  error: (error) => {
    console.error('Error en login:', error.message);
  }
});
```

##### `logout(): void`
Cierra la sesión del usuario.
```typescript
this.authService.logout();
// Limpia localStorage y redirige a /login
```

##### `getToken(): string | null`
Obtiene el token JWT almacenado.
```typescript
const token = this.authService.getToken();
```

##### `getUserInfo(): UserInfo | null`
Obtiene la información del usuario almacenada.
```typescript
const user = this.authService.getUserInfo();
if (user) {
  console.log(`Bienvenido, ${user.fullName}`);
}
```

##### `isAuthenticated: Signal<boolean>`
Signal que indica si el usuario está autenticado.
```typescript
@Component({...})
export class MiComponente {
  authService = inject(AuthService);
  
  isLoggedIn = this.authService.isAuthenticated;
  
  // En el template: {{ isLoggedIn() }}
}
```

##### `currentUser$: Observable<UserInfo | null>`
Observable del usuario actual (compatible con pipes async).
```typescript
<div *ngIf="authService.currentUser$ | async as user">
  Hola, {{ user.fullName }}
</div>
```

---

### 2. OnboardingService (`services/onboarding.service.ts`)

Servicio para gestionar el proceso de onboarding.

#### Métodos Públicos:

##### `saveProgress(dto: SaveProgressDto): Observable<OnboardingStatusDto>`
Guarda el progreso del onboarding.
```typescript
const progressDto: SaveProgressDto = {
  currentStep: 2,
  isCompleted: false,
  data: {
    fullName: 'Juan Pérez',
    email: 'juan@example.com',
    summary: 'Desarrollador...',
    skills: ['Angular', 'TypeScript'],
    experiences: [...],
    educations: [...]
  }
};

this.onboardingService.saveProgress(progressDto).subscribe({
  next: (status) => {
    console.log('Progreso guardado:', status);
    // Notificación SignalR se envía automáticamente
  },
  error: (error) => {
    console.error('Error al guardar:', error.message);
  }
});
```

##### `getResume(): Observable<OnboardingStatusDto | null>`
Recupera el estado actual del onboarding.
```typescript
this.onboardingService.getResume().subscribe({
  next: (status) => {
    if (status) {
      console.log('Progreso encontrado:', status);
      this.currentStep = status.currentStep;
      this.formData = status.data;
    } else {
      console.log('No hay progreso guardado, iniciar desde paso 1');
    }
  },
  error: () => {
    console.log('Usuario nuevo, iniciar onboarding');
  }
});
```

##### `complete(): Observable<ProfessionalProfileDto>`
Completa el proceso de onboarding.
```typescript
this.onboardingService.complete().subscribe({
  next: (profile) => {
    console.log('Onboarding completado:', profile);
    this.router.navigate(['/success']);
  },
  error: (error) => {
    console.error('Error al completar:', error.message);
  }
});
```

---

### 3. authInterceptor (`interceptors/auth.interceptor.ts`)

Interceptor HTTP que:
1. ✅ Agrega automáticamente el token JWT a peticiones `/api`
2. ✅ Maneja errores 401 (token expirado) redirigiendo al login
3. ✅ Limpia localStorage cuando hay un 401

```typescript
// Se configura automáticamente en app.config.ts
provideHttpClient(withInterceptors([authInterceptor]))
```

**Funcionalidad:**
- Detecta peticiones a `/api`
- Agrega header: `Authorization: Bearer <token>`
- Si recibe 401 → limpia storage y redirige a `/login`
- Si recibe 403 → log de acceso denegado
- Si recibe 500 → log de error del servidor

---

## 🗂️ Modelos y DTOs (`models/api.types.ts`)

Todos los tipos TypeScript basados en `API_CONTEXT_COMPLETE.md`:

### DTOs de Autenticación
- `RegisterDto`
- `LoginDto`
- `AuthResponseDto`
- `UserInfo`

### DTOs de Onboarding
- `SaveProgressDto`
- `OnboardingStatusDto`
- `OnboardingData`
- `WorkEntry`
- `EducationEntry`

### DTOs de Perfil Profesional
- `ProfessionalProfileDto`
- `ProfileSkillDto`
- `WorkExperienceDto`
- `EducationDto`

### Wrapper Universal
- `ApiResponse<T>` - Todas las respuestas del API

---

## ⚙️ Configuración de Entornos

### `environment.ts` (Desarrollo)
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7295/api',
  signalRUrl: 'https://localhost:7295/hubs/notifications',
  tokenKey: 'authToken',
  userKey: 'userInfo'
};
```

### `environment.prod.ts` (Producción)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.vertex.com/api',  // Cambiar por URL real
  signalRUrl: 'https://api.vertex.com/hubs/notifications',
  tokenKey: 'authToken',
  userKey: 'userInfo'
};
```

---

## 🔐 Flujo de Autenticación

```
1. Usuario hace login/register
   ↓
2. AuthService recibe AuthResponseDto con token
   ↓
3. Token se guarda en localStorage (key: 'authToken')
   ↓
4. UserInfo se guarda en localStorage (key: 'userInfo')
   ↓
5. Signal isAuthenticated se actualiza a true
   ↓
6. Todas las peticiones HTTP incluyen: Authorization: Bearer <token>
   (gracias al authInterceptor)
   ↓
7. Si token expira (401) → authInterceptor limpia storage y redirige a /login
```

---

## 📝 Ejemplo Completo: Login y Guardar Progreso

```typescript
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';

@Component({...})
export class LoginComponent {
  private authService = inject(AuthService);
  private onboardingService = inject(OnboardingService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          
          // Verificar si hay progreso de onboarding
          this.onboardingService.getResume().subscribe({
            next: (status) => {
              if (status && !status.isCompleted) {
                // Hay progreso, reanudar
                this.router.navigate(['/onboarding']);
              } else if (status && status.isCompleted) {
                // Ya completó el onboarding
                this.router.navigate(['/dashboard']);
              } else {
                // Nuevo usuario
                this.router.navigate(['/onboarding']);
              }
            },
            error: () => {
              // No hay progreso, iniciar onboarding
              this.router.navigate(['/onboarding']);
            }
          });

          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.message);
          this.isLoading.set(false);
        }
      });
    }
  }
}
```

---

## ⚠️ Notas Importantes

1. **Token en Headers:** El interceptor agrega automáticamente el token. NO lo agregues manualmente en los servicios.

2. **UserId:** NUNCA envíes el `userId` en el body. El backend lo extrae del token JWT.

3. **Errores 401:** El interceptor maneja automáticamente tokens expirados.

4. **ApiResponse<T>:** Todas las respuestas del API usan este wrapper. Los servicios ya lo desenvuelven.

5. **Environment:** Usa `environment.apiUrl` en lugar de hardcodear URLs.

6. **Signals vs Observables:** 
   - `isAuthenticated` es un Signal (para templates)
   - `currentUser$` es un Observable (para pipes async)

---

## 🧪 Testing

```typescript
// Ejemplo de test para AuthService
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should login successfully', () => {
    const mockResponse: ApiResponse<AuthResponseDto> = {
      success: true,
      statusCode: 200,
      message: 'Login exitoso',
      data: {
        token: 'fake-token',
        email: 'test@test.com',
        fullName: 'Test User',
        expiresAt: new Date().toISOString()
      },
      errors: []
    };

    service.login({ email: 'test@test.com', password: 'Test123' })
      .subscribe(response => {
        expect(response.token).toBe('fake-token');
        expect(service.isAuthenticated()).toBe(true);
      });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
```

---

**Última actualización:** Enero 2026  
**Stack:** Angular 21 + TypeScript + RxJS + Signals
