# 🏗️ Arquitectura - Separación de Responsabilidades (SoC)

## 📋 Principios Aplicados

### 1. **NgRx Strict Reactive Pattern**
- ✅ **Componentes**: Solo UI y eventos de usuario
- ✅ **Store**: Única fuente de verdad para el estado
- ✅ **Effects**: Lógica asíncrona (HTTP, navegación, side effects)
- ✅ **Mappers**: Transformación de datos entre capas
- ✅ **Services**: Solo llamadas HTTP (usados por Effects, NUNCA por componentes)

### 2. **Zero Business Logic in Components**
Los componentes están **purificados** y solo contienen:
- Declaración de formularios
- Signals derivados del Store mediante `store.selectSignal()`
- Métodos que **despachan acciones** (`store.dispatch()`)
- Renderizado condicional en templates

### 3. **Data Transformation Layer (Mapper Pattern)**
Toda transformación de datos está **centralizada** en utilidades dedicadas:
- Conversión de fechas (Date ↔ ISO String)
- Normalización de estructuras (singular/plural)
- Construcción de DTOs para API
- Hidratación de formularios desde Store/API

---

## 🗂️ Estructura de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                      │
│  - Components (OnboardingComponent, LoginComponent)         │
│  - Templates (HTML)                                          │
│  - Signals (readonly, derivados del Store)                   │
│  - Dispatch Actions (store.dispatch)                         │
└───────────────────────────┬─────────────────────────────────┘
                            │ dispatch()
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       STATE LAYER (NgRx)                     │
│  - Store (única fuente de verdad)                            │
│  - Actions (eventos del sistema)                             │
│  - Reducers (actualizaciones de estado)                      │
│  - Selectors (lectura optimizada del estado)                 │
└───────────────────────────┬─────────────────────────────────┘
                            │ effects trigger
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       EFFECTS LAYER                          │
│  - auth.effects.ts (login, register, token refresh)         │
│  - onboarding.effects.ts (save, load, complete)             │
│  → Coordinan Services, Mappers y dispatch de resultados     │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                           │
│  - auth.service.ts (POST /auth/login, /auth/register)       │
│  - onboarding.service.ts (POST /onboarding/save-progress)   │
│  → Solo llamadas HTTP, NO lógica de negocio                  │
└───────────────────────────┬─────────────────────────────────┘
                            │ response data
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    TRANSFORMATION LAYER                      │
│  - OnboardingMapper (toFormData, toSaveDto, toIsoString)    │
│  → Conversión de datos entre API y formularios              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Componentes Principales

### **OnboardingComponent** (100% Reactive)
**Ubicación**: `src/app/pages/onboarding/onboarding.component.ts`

**Responsabilidades**:
- Renderizar formulario de 3 pasos (account, experiences, review)
- Despachar acciones de navegación y guardado
- Reaccionar a cambios del Store mediante signals

**NO hace**:
- ❌ Llamadas HTTP directas
- ❌ Transformación de datos (fechas, mapeos, etc.)
- ❌ Lógica de negocio (validaciones complejas, cálculos)

**Signals del Store**:
```typescript
readonly currentStep = this.store.selectSignal(selectCurrentStep);
readonly isLoading = this.store.selectSignal(selectOnboardingLoading);
readonly isCompleted = this.store.selectSignal(selectIsCompleted);
readonly errorMessage = this.store.selectSignal(selectOnboardingError);
```

**Métodos clave**:
- `handleNavigation()`: Construye DTO usando Mapper y despacha `saveProgress`
- `finishOnboarding()`: Despacha `completeOnboarding`
- `clearError()`: Despacha `clearError`

---

### **LoginComponent** (100% Reactive)
**Ubicación**: `src/app/pages/login/login.component.ts`

**Responsabilidades**:
- Renderizar formularios de login/registro
- Despachar acciones de autenticación
- Mostrar notificaciones según resultado

**NO hace**:
- ❌ Llamadas HTTP directas
- ❌ Manejo de tokens
- ❌ Redirección manual (manejado por Effects)

**Signals del Store**:
```typescript
readonly isLoading = this.store.selectSignal(selectAuthLoading);
readonly errorMessage = this.store.selectSignal(selectAuthError);
readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
```

**Métodos clave**:
- `onLoginSubmit()`: Despacha `AuthActions.login({ credentials })`
- `onRegisterSubmit()`: Despacha `AuthActions.register({ credentials })`
- `clearError()`: Despacha `AuthActions.clearError()`

---

## 🧩 Mapper Pattern

### **OnboardingMapper**
**Ubicación**: `src/app/pages/onboarding/utils/onboarding.mapper.ts`

**Métodos**:

#### `toFormData(input: any): any`
**Propósito**: Hidratar formularios desde datos del Store/API

**Transformaciones**:
- Parsea JSON si es string
- Normaliza `experience` → `experiences` (plural)
- Convierte strings ISO → Date objects
- Infiere `isCurrent: true` si endDate es null
- Mapea variantes de roles (`jobTitle`, `position`, `role`)

**Ejemplo**:
```typescript
// Input API:
{ experience: [{ startDate: "2023-01-01", endDate: null }] }

// Output FormData:
{ experiences: [{ startDate: Date(2023,0,1), endDate: null, isCurrent: true }] }
```

#### `toSaveDto(accountFormValue, experiencesControls, skills, targetStep): SaveProgressDto`
**Propósito**: Construir payload completo para `POST /onboarding/save-progress`

**Transformaciones**:
- Convierte Date objects → ISO strings
- Mapea FormArray controls → WorkEntry[]
- Limpia strings (trim)
- Estructura `dateRange: { start, end }`
- Maneja `isCurrent: true` → `endDate: null`

**Ejemplo**:
```typescript
// Output:
{
  currentStep: 1,
  isCompleted: false,
  data: {
    fullName: "Juan Pérez",
    summary: "Desarrollador...",
    skills: ["Angular", "TypeScript"],
    experiences: [{
      company: "TechCorp",
      role: "Frontend Developer",
      description: "Desarrollo de interfaces...",
      dateRange: { start: "2023-01-01T00:00:00.000Z", end: null }
    }],
    educations: []
  }
}
```

#### `toIsoString(date: unknown): string` (privado)
**Propósito**: Convertir fechas a ISO string de forma segura

**Casos manejados**:
- `Date` object → `date.toISOString()`
- `string` → devuelve tal cual (ya es ISO)
- `null/undefined` → devuelve `''`

---

## 🔄 Flujo de Datos Típico

### **Escenario: Usuario navega al paso siguiente**

```
1. Usuario hace clic en "Continuar" (template)
   ↓
2. OnboardingComponent.saveAndContinue()
   ↓
3. handleNavigation('next')
   ↓
4. OnboardingMapper.toSaveDto(formValue, controls, skills, step)
   ↓ (devuelve SaveProgressDto limpio)
5. store.dispatch(OnboardingActions.saveProgress({ dto }))
   ↓
6. onboarding.effects.ts → saveProgress$ effect
   ↓
7. OnboardingService.saveProgressSerialized(dto)
   ↓ (HTTP POST)
8. API responde 200 OK
   ↓
9. Effect despacha OnboardingActions.saveProgressSuccess({ currentStep })
   ↓
10. Reducer actualiza state.onboarding.currentStep = 1
   ↓
11. Selector selectCurrentStep emite nuevo valor
   ↓
12. Component signal se actualiza automáticamente
   ↓
13. Template re-renderiza con nuevo paso
```

---

## ✅ Checklist de Cumplimiento

### **Componentes**
- ✅ No inyectan `OnboardingService` ni `AuthService`
- ✅ Solo usan `Store` para lectura/escritura de estado
- ✅ Todas las signals son `readonly` y derivadas del Store
- ✅ Métodos solo despachan acciones o manejan eventos de UI
- ✅ No contienen lógica de transformación de datos

### **Effects**
- ✅ Colocados en constructor (no en `ngOnInit`)
- ✅ Manejan efectos secundarios (HTTP, navegación, notificaciones)
- ✅ Despachan acciones de éxito/error
- ✅ Usan servicios para llamadas HTTP

### **Mappers**
- ✅ Métodos estáticos (sin estado)
- ✅ Manejan toda la transformación de datos
- ✅ Separados por dominio (`OnboardingMapper`)
- ✅ Bidireccionales (API ↔ Form)

### **Services**
- ✅ Solo contienen llamadas HTTP
- ✅ Devuelven `Observable<T>`
- ✅ No contienen lógica de negocio
- ✅ No modifican datos (solo transporte)

---

## 🚨 Anti-patrones PROHIBIDOS

```typescript
// ❌ NUNCA: Inyectar servicios HTTP en componentes
export class OnboardingComponent {
  private service = inject(OnboardingService); // ❌
}

// ❌ NUNCA: Transformar datos en el componente
const experiencesData = this.experiences.controls.map(ctrl => ({
  startDate: ctrl.value.startDate.toISOString() // ❌
}));

// ❌ NUNCA: Llamar servicios directamente
this.authService.login(credentials).subscribe(...); // ❌

// ❌ NUNCA: Modificar signals del Store directamente
this.errorMessage.set(null); // ❌ (es readonly)

// ✅ CORRECTO: Despachar acción para limpiar error
this.store.dispatch(OnboardingActions.clearError());

// ✅ CORRECTO: Usar Mapper para transformar
const dto = OnboardingMapper.toSaveDto(...);
this.store.dispatch(OnboardingActions.saveProgress({ dto }));
```

---

## 📊 Métricas de Calidad

| Métrica | Estado |
|---------|--------|
| Componentes sin inyección de servicios HTTP | ✅ 2/2 (100%) |
| Transformaciones centralizadas en Mappers | ✅ 100% |
| Uso de signals para estado reactivo | ✅ 100% |
| Effects en constructor (no ngOnInit) | ✅ 100% |
| Formularios reactivos (no template-driven) | ✅ 100% |
| Separación Store/UI | ✅ Estricta |

---

## 🛠️ Herramientas de Validación

### **Buscar violaciones de SoC**:
```bash
# Buscar inyección de servicios HTTP en componentes
grep -rn "inject(.*Service)" src/app/pages/

# Buscar transformaciones en componentes
grep -rn "toISOString\|JSON.parse\|new Date(" src/app/pages/

# Buscar llamadas directas a servicios
grep -rn "\.subscribe(" src/app/pages/
```

---

## 📚 Referencias

- [NgRx Best Practices](https://ngrx.io/guide/eslint-plugin/rules)
- [Angular Signals RFC](https://github.com/angular/angular/discussions/49090)
- [Martin Fowler - Mapper Pattern](https://martinfowler.com/eaaCatalog/dataMapper.html)
