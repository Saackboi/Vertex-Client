# VertexClient Documentación / Documentation (Angular 21 + Ng-Zorro)

Fuente única para el frontend. Incluye stack, configuración, rutas, layout, contratos de API, servicios y flujos. Los contratos backend están en ../Vertex/docs/API_CONTEXT_COMPLETE.md.

## ES (Español)
### 1) Stack y arquitectura
- Angular 21, componentes standalone y Signals; Ng-Zorro como único kit UI.
- Guards e interceptores funcionales; HttpClient con interceptor de auth.
- NgRx listo con signals (features de auth/onboarding registradas en app.config.ts).
- Layout global con nz-layout (header/content/footer); cada componente importa sus módulos Ng-Zorro.

### 2) Estructura clave
- src/app/app.config.ts: providers globales (router, http + authInterceptor, animaciones, Ng-Zorro icons/config es_ES, store/effects).
- src/app/app.routes.ts: '' landing, 'login', 'onboarding' protegido (authGuard, onboardingGuard); notifications/dashboard placeholder; wildcard -> ''.
- src/app/app.{ts,html,css}: shell y layout principal.
- src/app/pages: landing, login, onboarding, notifications.
- src/app/services: auth.service.ts, onboarding.service.ts.
- src/app/store: reducers/effects de auth y onboarding.

### 3) Configuración y comandos
- Prerrequisitos: Node 18+, npm 9+. Instalar: npm install
- Desarrollo: npm start (proxy.conf.json apunta /api a http://localhost:3000)
- Build: npm run build
- Tests: npm test

### 4) Rutas y guards
- Públicas: '/' landing, '/login'
- Protegidas: '/onboarding' (authGuard + onboardingGuard), '/notifications', '/dashboard'
- authGuard: verifica token en localStorage; sin token -> /login.

### 5) Layout
- nz-layout con nz-header (logo + acciones), nz-content con router-outlet, nz-footer con copy.
- Estilos base: header #001529, content #f0f2f5, altura completa.

### 6) Configuración Ng-Zorro
- En app.config.ts: provideNzIcons([...]), provideNzI18n(es_ES), provideNzConfig({ theme: { primaryColor: '#1890ff' } }). Importar módulos Ng-Zorro específicos en cada componente (NzButtonModule, NzFormModule, NzStepsModule, etc.).

### 7) Contratos de API (estrictos)
- JWT en Authorization: Bearer <token> (lo añade el interceptor).
- POST /api/auth/login: { email, password } -> { token, email, fullName, expiresAt }
- GET /api/onboarding/resume: { currentStep: number, data: object, isCompleted: boolean }
- POST /api/onboarding/save: { currentStep: number, data: object, isCompleted: boolean }
- No enviar userId; el backend lo obtiene del token. Usar el envoltorio ApiResponse<T> si aplica.

### 8) Servicios
- AuthService: login/register/logout; guarda token y usuario (localStorage keys: authToken, userInfo); signals isAuthenticated y currentUser$ observable.
- OnboardingService: getResume(), saveProgress(dto), complete(); maneja data como objeto.
- AuthInterceptor: agrega Authorization en /api; ante 401 limpia storage y redirige a /login.

### 9) Páginas
- Landing (/): hero + CTA a /login; usa NzGrid/NzCard/NzButton.
- Login (/login): formulario reactivo con NzForm/NzInput/NzButton/NzAlert/NzCard; POST /api/auth/login; almacena token y navega a /onboarding.
- Onboarding (/onboarding): NzSteps + formularios reactivos; al iniciar GET /resume para prefilling; en Siguiente POST /save con data; muestra éxito (nz-result) al completar.
- Notifications/Dashboard: placeholders protegidos.

### 10) Flujos
- Auth: login -> guarda token/usuario -> interceptor añade header -> guards protegen; 401 limpia y redirige.
- Onboarding: init GET /resume (si isCompleted redirigir a dashboard; si 404 empezar paso 1); cada paso POST /save con data; al final POST /save y opcional /complete.

### 11) Reglas y notas
- Solo Ng-Zorro (sin Material/Bootstrap). Importar módulos por componente standalone.
- data siempre objeto; no enviar userId.
- Usar environment.apiUrl/signalRUrl/tokenKey/userKey en vez de hardcodear URLs.
- Actualiza este documento cuando cambien rutas, contratos o layout/config global.

## EN (English)
### Stack & architecture
- Angular 21, standalone + Signals; Ng-Zorro only UI kit. Functional guards/interceptors; HttpClient with auth interceptor. NgRx (signals) wired in app.config.ts. Layout via nz-layout; each component imports its Ng-Zorro modules.

### Structure
- app.config.ts providers (router, http+authInterceptor, animations, Ng-Zorro icons/config es_ES, store/effects).
- app.routes.ts: '' landing, 'login', 'onboarding' protected (authGuard, onboardingGuard); notifications/dashboard placeholders; wildcard -> ''.
- app.{ts,html,css} shell/layout; pages (landing, login, onboarding, notifications); services (auth, onboarding); store (auth/onboarding reducers/effects).

### Setup & commands
- Prereqs Node 18+, npm 9+. Install: npm install. Dev: npm start (proxy /api->http://localhost:3000). Build: npm run build. Test: npm test.

### Routing/guards
- Public: '/', '/login'. Protected: '/onboarding', '/notifications', '/dashboard'. authGuard checks token, redirects to /login if missing.

### Layout
- nz-layout header/content/footer; header #001529, content #f0f2f5.

### Ng-Zorro config
- provideNzIcons, provideNzI18n(es_ES), provideNzConfig with primaryColor #1890ff. Import Ng-Zorro modules per component.

### API contracts (strict)
- JWT in Authorization: Bearer <token> (interceptor). POST /api/auth/login { email, password } -> { token, email, fullName, expiresAt }. GET /api/onboarding/resume returns { currentStep, data, isCompleted }. POST /api/onboarding/save expects { currentStep, data, isCompleted }. Do not send userId; use ApiResponse<T> semantics.

### Services
- AuthService (token/user storage, signals isAuthenticated, currentUser$). OnboardingService (getResume, saveProgress, complete) using data object. AuthInterceptor adds header, clears storage and routes to /login on 401.

### Pages & flows
- Landing: CTA to login. Login: reactive form, POST login, store token, goto onboarding. Onboarding: steps + forms, GET resume on init, POST save on navigation, success via nz-result. Notifications/Dashboard placeholders.
- Auth flow: login -> store -> interceptor -> guarded routes -> 401 cleanup. Onboarding flow: GET resume -> set step or dashboard -> POST save per step -> final save/complete.

### Rules
- Ng-Zorro only; standalone imports per component. data is object; never send userId. Use environment values for URLs/keys. Keep this doc updated when contracts/routes/layout change.
