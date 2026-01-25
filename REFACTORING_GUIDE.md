# Refactorización de Arquitectura - Vertex Client

## Resumen de Cambios

Esta refactorización reorganiza el código para seguir mejores prácticas de Angular + NgRx, separando responsabilidades y usando Observables con async pipe en lugar de signals.

---

## 1. Modelos Separados por Dominio

### Antes
Todos los modelos en un solo archivo: `models/api.types.ts`

### Después
Organización por dominios con barrel exports:

```
models/
├── index.ts                    # Barrel export principal
├── common/
│   └── api-response.model.ts   # Modelo genérico de respuesta
├── auth/
│   ├── index.ts
│   ├── login.dto.ts
│   ├── register.dto.ts
│   ├── auth-response.dto.ts
│   └── user-info.model.ts
├── onboarding/
│   ├── index.ts
│   ├── onboarding-data.model.ts
│   ├── work-entry.model.ts
│   ├── education-entry.model.ts
│   ├── save-progress.dto.ts
│   └── onboarding-status.dto.ts
└── profile/
    ├── index.ts
    ├── professional-profile.dto.ts
    ├── profile-skill.dto.ts
    ├── work-experience.dto.ts
    └── education.dto.ts
```

### Uso
```typescript
// Antes
import { SaveProgressDto, WorkEntry } from '../../models/api.types';

// Después
import { SaveProgressDto, WorkEntry } from '../../models';
```

---

## 2. Componente Onboarding - Separación de Responsabilidades

### Estructura Nueva

```
pages/onboarding/
├── onboarding.component.ts           # Componente original (signals)
├── onboarding-refactored.component.ts # Componente con observables + async pipe
├── onboarding.component.html
├── onboarding.component.css
├── constants/
│   └── onboarding.constants.ts       # Constantes y mensajes
├── helpers/
│   ├── form.utils.ts                  # Utilidades de formularios
│   └── date.utils.ts                  # Utilidades de fechas
├── types/
│   └── onboarding.types.ts            # Tipos específicos del componente
└── utils/
    └── onboarding.mapper.ts           # Mapper de datos
```

### Constantes Centralizadas

```typescript
// constants/onboarding.constants.ts
export const ONBOARDING_CONSTANTS = {
  STEPS: { TOTAL: 3, ACCOUNT: 0, EXPERIENCE: 1, REVIEW: 2 },
  MIN_SUMMARY_LENGTH: 50,
  MAX_SUMMARY_LENGTH: 500
} as const;

export const FORM_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es obligatorio',
  MIN_LENGTH: (min: number) => `Mínimo ${min} caracteres`,
  // ...
} as const;
```

### Helpers Reutilizables

```typescript
// helpers/form.utils.ts
export class FormUtils {
  static markFormDirty(formGroup: FormGroup): void { /*...*/ }
  static hasError(formGroup: FormGroup, fieldName: string): boolean { /*...*/ }
  static getErrorMessage(formGroup: FormGroup, fieldName: string): string { /*...*/ }
}

// helpers/date.utils.ts
export class DateUtils {
  static toMonthFormat(d: Date | null): string | null { /*...*/ }
  static monthFormatToIso(monthStr: string): string { /*...*/ }
  static formatDisplayDate(date: string | Date): string { /*...*/ }
}
```

---

## 3. Migración: Signals → Observables + Async Pipe

### Antes (Signals)

```typescript
// Component
export class OnboardingComponent {
  readonly currentStep = this.store.selectSignal(selectCurrentStep);
  readonly isLoading = computed(() => this.loading() || this.saving());
  
  constructor() {
    effect(() => {
      const step = this.currentStep();
      // lógica...
    });
  }
}
```

```html
<!-- Template -->
<div *ngIf="isLoading()">Cargando...</div>
<p>Paso {{ currentStep() + 1 }}</p>
```

### Después (Observables)

```typescript
// Component
export class OnboardingComponentRefactored implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  readonly currentStep$: Observable<number> = this.store.select(selectCurrentStep);
  readonly isLoading$: Observable<boolean> = this.store.select(selectOnboardingLoading);
  
  ngOnInit(): void {
    this.subscribeToStoreUpdates();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private subscribeToStoreUpdates(): void {
    this.onboardingData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // lógica...
      });
  }
}
```

```html
<!-- Template -->
<div *ngIf="isLoading$ | async">Cargando...</div>
<p>Paso {{ (currentStep$ | async)! + 1 }}</p>
```

### Ventajas de Observables + Async Pipe

1. **Gestión automática de suscripciones**: El async pipe se desuscribe automáticamente
2. **Patrón estándar de NgRx**: Documentación y ejemplos más abundantes
3. **Mejor para streams complejos**: Operators como `combineLatest`, `switchMap`, etc.
4. **OnPush change detection**: Mejor rendimiento
5. **Menos memory leaks**: `takeUntil(destroy$)` patrón consistente

---

## 4. Componente Login - Separación de Responsabilidades

### Estructura Nueva

```
pages/login/
├── login.component.ts
├── login.component.html
├── login.component.css
├── constants/
│   └── login.constants.ts
└── helpers/
    └── login-form.utils.ts
```

### Constantes y Validaciones

```typescript
// constants/login.constants.ts
export const LOGIN_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  EMAIL_PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
} as const;

export const LOGIN_MESSAGES = {
  SUCCESS: { LOGIN: 'Inicio de sesión exitoso...', REGISTER: '...' },
  ERROR: { INVALID_CREDENTIALS: '...', USER_EXISTS: '...' },
  VALIDATION: { REQUIRED: '...', INVALID_EMAIL: '...' }
} as const;
```

---

## 5. Actualización de Imports

Todos los archivos que importaban desde `models/api.types.ts` se actualizaron:

### Archivos Actualizados

- ✅ `pages/onboarding/onboarding.component.ts`
- ✅ `pages/login/login.component.ts`
- ✅ `store/onboarding/onboarding.reducer.ts`
- ✅ `store/onboarding/onboarding.actions.ts`
- ✅ `store/auth/auth.reducer.ts`
- ✅ `store/auth/auth.actions.ts`
- ✅ `services/onboarding.service.ts`
- ✅ `services/auth.service.ts`

### Patrón de Migración

```typescript
// Antes
import { LoginDto, RegisterDto } from '../../models/api.types';

// Después
import { LoginDto, RegisterDto } from '../../models';
```

---

## 6. Próximos Pasos

### Para usar el componente refactorizado:

1. **Actualizar las rutas** en `app.routes.ts`:
   ```typescript
   {
     path: 'onboarding',
     loadComponent: () => import('./pages/onboarding/onboarding-refactored.component')
       .then(m => m.OnboardingComponentRefactored)
   }
   ```

2. **Actualizar el template HTML**:
   - Cambiar `currentStep()` por `currentStep$ | async`
   - Cambiar `isLoading()` por `isLoading$ | async`
   - Cambiar `isCompleted()` por `isCompleted$ | async`
   - Agregar `*ngIf` con async pipe para todas las propiedades observables

3. **Migrar otros componentes**:
   - Aplicar el mismo patrón a `login.component.ts`
   - Aplicar el mismo patrón a `notifications.component.ts`

---

## 7. Mejores Prácticas Aplicadas

### ✅ Arquitectura

- Separación por dominios (auth, onboarding, profile)
- Barrel exports para imports limpios
- Helpers reutilizables
- Constantes centralizadas

### ✅ NgRx

- Observables con async pipe
- takeUntil pattern para unsubscribe
- OnDestroy lifecycle hook
- No más effects en constructor

### ✅ TypeScript

- Tipos específicos del dominio
- Interfaces bien documentadas
- Type safety en toda la aplicación

### ✅ Mantenibilidad

- Un archivo, una responsabilidad
- Nombres descriptivos
- Código autodocumentado
- Fácil de testear

---

## 8. Estructura Completa del Proyecto

```
src/app/
├── models/
│   ├── index.ts
│   ├── common/
│   ├── auth/
│   ├── onboarding/
│   └── profile/
├── pages/
│   ├── onboarding/
│   │   ├── constants/
│   │   ├── helpers/
│   │   ├── types/
│   │   ├── utils/
│   │   └── *.component.*
│   └── login/
│       ├── constants/
│       ├── helpers/
│       └── *.component.*
├── services/
├── store/
│   ├── auth/
│   └── onboarding/
├── guards/
├── interceptors/
└── validators/
```

---

## Migración Gradual

El proyecto ahora tiene **dos versiones del componente onboarding**:
- `onboarding.component.ts` - Original con signals (actual)
- `onboarding-refactored.component.ts` - Refactorizado con observables (nuevo)

Esto permite:
1. Comparar ambas implementaciones
2. Testear la nueva versión sin romper la actual
3. Migrar cuando estés listo

Para cambiar, solo actualiza la ruta en `app.routes.ts`.
