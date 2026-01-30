# Vertex Client - Angular Application

## 🎯 Arquitectura NgRx Reactiva Estricta

Este proyecto implementa una arquitectura **100% reactiva** usando NgRx con **Separación de Responsabilidades (SoC)** completa.

### 📋 Principios Clave

```
Componentes → Solo UI + dispatch(actions)
Store → Única fuente de verdad
Effects → Lógica asíncrona (HTTP, side effects)
Mappers → Transformación de datos
Services → Solo llamadas HTTP (usados por Effects)
```

### 🏗️ Estructura

```
src/app/
├── pages/
│   ├── onboarding/         # Wizard de 3 pasos
│   │   ├── utils/
│   │   │   └── onboarding.mapper.ts    ✅ Transformaciones centralizadas
│   │   ├── onboarding.component.ts     ✅ 100% reactivo (sin servicios HTTP)
│   │   └── onboarding.component.html
│   └── login/              # Login/Register
│       ├── login.component.ts          ✅ 100% reactivo
│       └── login.component.html
├── store/
│   ├── auth/               # Estado de autenticación
│   │   ├── auth.actions.ts
│   │   ├── auth.effects.ts             ✅ Coordina HTTP + Router
│   │   ├── auth.reducer.ts
│   │   └── auth.selectors.ts
│   └── onboarding/         # Estado de onboarding
│       ├── onboarding.actions.ts
│       ├── onboarding.effects.ts       ✅ Coordina HTTP + navegación
│       ├── onboarding.reducer.ts
│       └── onboarding.selectors.ts
├── services/
│   ├── auth.service.ts                 ✅ Solo HTTP (login, register)
│   └── onboarding.service.ts           ✅ Solo HTTP (save, load)
├── guards/
│   ├── auth.guard.ts                   ✅ Protección de rutas
│   └── onboarding.guard.ts
└── interceptors/
    └── auth.interceptor.ts             ✅ Token JWT automático
```

---

## 🚀 Inicio Rápido

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm start
# Servidor en http://localhost:4200
```

### Build Producción
```bash
npm run build
```

### Tests
```bash
npm test
```

---

## 🔍 Componentes Reactivos

### **OnboardingComponent**
✅ **NO inyecta** `OnboardingService`  
✅ **NO transforma** datos (usa `OnboardingMapper`)  
✅ **Solo despacha** acciones al Store  
✅ **Signals readonly** del Store  

### **LoginComponent**
✅ **NO inyecta** `AuthService`  
✅ **Solo despacha** acciones de login/register  
✅ **Signals readonly** del Store  

---

## 📊 Flujo de Datos

### Ejemplo: Guardar progreso de onboarding

```
Usuario hace clic en "Continuar"
  ↓
OnboardingComponent.saveAndContinue()
  ↓
handleNavigation('next')
  ↓
OnboardingMapper.toSaveDto(formValue, ...) 🔧 Transforma datos
  ↓
store.dispatch(OnboardingActions.saveProgress({ dto }))
  ↓
onboarding.effects.ts → saveProgress$ 🌐 HTTP POST
  ↓
API responde 200 OK
  ↓
Effect despacha saveProgressSuccess({ currentStep })
  ↓
Reducer actualiza state.onboarding.currentStep
  ↓
Selector selectCurrentStep emite nuevo valor
  ↓
Component signal se actualiza automáticamente ⚡
  ↓
Template re-renderiza con nuevo paso
```

---

## 🧩 Mapper Pattern

### **OnboardingMapper** (`utils/onboarding.mapper.ts`)

#### `toFormData(input: any): any`
Hidrata formularios desde API/Store:
- Parsea JSON si es string
- Normaliza `experience` → `experiences`
- Convierte ISO strings → Date objects
- Infiere `isCurrent: true` si `endDate` es null

#### `toSaveDto(...): SaveProgressDto`
Construye payload para API:
- Convierte Date objects → ISO strings
- Mapea FormArray → WorkEntry[]
- Limpia strings (trim)
- Estructura `dateRange: { start, end }`

---

## 🔐 Autenticación

### Flow Login
```
LoginComponent.onLoginSubmit()
  ↓
store.dispatch(AuthActions.login({ credentials }))
  ↓
auth.effects.ts → login$ → POST /auth/login
  ↓
Response: { token, user }
  ↓
Token guardado en localStorage
  ↓
AuthInterceptor inyecta Bearer token en todas las requests
  ↓
Router navega a /onboarding
```

### AuthGuard
Protege rutas verificando `selectIsAuthenticated`:
```typescript
// app.routes.ts
{
  path: 'onboarding',
  component: OnboardingComponent,
  canActivate: [AuthGuard] // ✅ Solo autenticados
}
```

---

## 📖 Documentación Completa

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura detallada con diagramas
- **[SERVICES_DOCUMENTATION.md](./SERVICES_DOCUMENTATION.md)** - API de servicios
- **[CONFIGURATION_SUMMARY.md](./CONFIGURATION_SUMMARY.md)** - Configuración del proyecto
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Guía de instalación y desarrollo

---

## ✅ Checklist de Calidad

| Criterio | Estado |
|----------|--------|
| Componentes sin servicios HTTP | ✅ 100% |
| Transformaciones en Mappers | ✅ 100% |
| Effects en constructor | ✅ 100% |
| Signals readonly del Store | ✅ 100% |
| Guards para rutas protegidas | ✅ 100% |
| Interceptor para JWT | ✅ 100% |

---

## 🛠️ Stack Tecnológico

- **Angular 21** - Framework
- **NgRx** - State Management
- **Ng-Zorro** - UI Components
- **TypeScript** - Lenguaje
- **RxJS** - Reactive Programming
- **Signals** - Reactive Primitives

---

## 📝 Scripts NPM

```json
{
  "start": "ng serve",
  "build": "ng build",
  "test": "ng test",
  "lint": "ng lint"
}
```

---

## 🚨 Anti-patrones PROHIBIDOS

```typescript
// ❌ NUNCA: Inyectar servicios HTTP en componentes
private service = inject(OnboardingService);

// ❌ NUNCA: Transformar datos en componentes
const iso = date.toISOString(); // Usar Mapper

// ❌ NUNCA: Llamar servicios directamente
this.authService.login(...).subscribe(...);

// ✅ CORRECTO: Despachar acciones
this.store.dispatch(AuthActions.login({ credentials }));
```

---
