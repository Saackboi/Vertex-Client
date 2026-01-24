# 🚀 VertexClient - Angular 21 + Ng-Zorro

Cliente web profesional construido con **Angular v21** y **Ng-Zorro (Ant Design)** para el sistema VertexClient.

## 📋 Características

- ✅ **Angular 21** (Standalone Components, Signals)
- ✅ **Ng-Zorro** (Ant Design para Angular)
- ✅ **Arquitectura Moderna:** Functional Guards, HTTP Interceptors
- ✅ **Formularios Reactivos** con validación
- ✅ **Autenticación** con JWT y guards
- ✅ **Onboarding Multi-Paso** con `nz-steps`
- ✅ **UI/UX Profesional** con componentes de Ng-Zorro
- ✅ **Integración API** estricta según contratos backend

## 🎯 Páginas Implementadas

### 1. Landing Page (`/`)
Página de bienvenida con diseño moderno y CTA para comenzar.

### 2. Login (`/login`)
Sistema de autenticación con:
- Formulario reactivo con validación
- Integración con API: `POST /api/auth/login`
- Manejo de errores y estados de carga
- Almacenamiento de token JWT

### 3. Onboarding (`/onboarding`)
Proceso de onboarding en 3 pasos:
- **Paso 1:** Información Personal
- **Paso 2:** Información Profesional  
- **Paso 3:** Preferencias

Características:
- Navegación con `nz-steps`
- Guardado automático del progreso
- Carga de estado previo desde API
- Pantalla de éxito al completar

## 🏗️ Arquitectura

```
src/app/
├── guards/
│   └── auth.guard.ts           # Guard para rutas protegidas
├── interceptors/
│   └── auth.interceptor.ts     # Interceptor HTTP para token
├── pages/
│   ├── landing/                # Página de inicio
│   ├── login/                  # Página de login
│   └── onboarding/             # Proceso de onboarding
├── app.config.ts               # Configuración global
├── app.routes.ts               # Definición de rutas
└── app.ts                      # Componente raíz con layout
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- npm 9+

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm start
```
La aplicación estará disponible en `http://localhost:4200`

**Nota:** El proxy está configurado para redirigir `/api` a `http://localhost:3000`

### Build de Producción
```bash
npm run build
```

### Testing
```bash
npm test
```

## 🔧 Configuración

### Proxy (proxy.conf.json)
El proyecto incluye configuración de proxy para desarrollo:
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

### Interceptor HTTP
El interceptor `authInterceptor` agrega automáticamente el token a todas las peticiones a `/api`:
```typescript
Authorization: Bearer <TOKEN>
```

### Guard de Autenticación
El `authGuard` protege rutas que requieren autenticación verificando el token en `localStorage`.

## 📡 Integración API

### Contratos Implementados

#### Auth
```typescript
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string }
```

#### Onboarding
```typescript
GET /api/onboarding/resume
Headers: Authorization: Bearer <TOKEN>
Response: {
  currentStep: number,
  serializedData: string,
  isCompleted: boolean
}

POST /api/onboarding/save
Headers: Authorization: Bearer <TOKEN>
Body: {
  currentStep: number,
  serializedData: string  // JSON.stringify(data)
}
```

**⚠️ Importante:** `serializedData` debe ser un **string**, no un objeto plano.

## 🎨 Componentes Ng-Zorro Usados

- `nz-layout` - Layout principal
- `nz-header` / `nz-footer` - Header y footer
- `nz-steps` - Navegación por pasos
- `nz-form` - Formularios reactivos
- `nz-input` - Campos de entrada
- `nz-button` - Botones
- `nz-card` - Tarjetas
- `nz-grid` - Sistema de grid
- `nz-select` - Selectores dropdown
- `nz-result` - Pantallas de resultado
- `nz-alert` - Alertas
- `nz-icon` - Iconos
- `nz-message` - Notificaciones toast

## 📚 Documentación Adicional

Para más detalles sobre la implementación, consulta:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Guía completa de configuración

## 🛠️ Stack Tecnológico

- **Angular:** 21.1.0
- **Ng-Zorro:** 19.x.x
- **TypeScript:** 5.9.2
- **RxJS:** 7.8.0
- **Vitest:** 4.0.8

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia servidor de desarrollo con proxy |
| `npm run build` | Genera build de producción |
| `npm test` | Ejecuta tests unitarios |
| `npm run watch` | Build en modo watch |

## 🔐 Autenticación

El sistema usa JWT almacenado en `localStorage`:
- **Key:** `authToken`
- **Header HTTP:** `Authorization: Bearer <TOKEN>`
- **Guard:** `authGuard` protege `/onboarding`

## 🌐 Navegación

- `/` - Landing page (público)
- `/login` - Login (público)
- `/onboarding` - Onboarding (protegido)

## 📄 Licencia

Proyecto privado - VertexClient ©2026

---

**Desarrollado con:** Angular 21 + Ng-Zorro + TypeScript  
**Arquitectura:** Standalone Components + Signals + Functional Guards
