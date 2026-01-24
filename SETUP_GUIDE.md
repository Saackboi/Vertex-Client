# VertexClient - Configuración Completa

## ✅ Stack Tecnológico Implementado

- **Framework:** Angular v21 (Standalone Components)
- **UI Library:** Ng-Zorro (ng-zorro-antd) - Ant Design
- **Architecture:** Signals, Functional Guards, Reactive Forms
- **HTTP:** HttpClient con interceptores
- **State Management:** Ready para NgRx Signals

---

## 📁 Estructura del Proyecto

```
src/app/
├── guards/
│   └── auth.guard.ts              # Guard funcional para rutas protegidas
├── pages/
│   ├── landing/
│   │   ├── landing.component.ts
│   │   ├── landing.component.html
│   │   └── landing.component.css
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.css
│   └── onboarding/
│       ├── onboarding.component.ts
│       ├── onboarding.component.html
│       └── onboarding.component.css
├── app.config.ts                  # Configuración global (Ng-Zorro, HTTP, etc.)
├── app.routes.ts                  # Definición de rutas
├── app.ts                         # Componente raíz con layout
├── app.html                       # Template del layout principal
└── app.css                        # Estilos del layout
```

---

## 🚀 Configuración Implementada

### 1. **app.config.ts**
Providers configurados:
- ✅ `provideNzIcons` - Iconos de Ng-Zorro
- ✅ `provideNzI18n(es_ES)` - Internacionalización en español
- ✅ `provideNzConfig` - Tema personalizado
- ✅ `provideHttpClient()` - Cliente HTTP
- ✅ `provideAnimationsAsync()` - Animaciones

### 2. **app.routes.ts**
Rutas configuradas:
- `/` → Landing Page (público)
- `/login` → Login (público)
- `/onboarding` → Onboarding (protegido con `authGuard`)
- `/**` → Redirect a `/`

### 3. **Guards**
- `authGuard`: Verifica token en localStorage
- Si no hay token → redirige a `/login`
- Si hay token → permite acceso

---

## 🎨 Layout Principal (app.html)

Usa componentes de Ng-Zorro:
- `<nz-layout>` - Contenedor principal
- `<nz-header>` - Header con logo "VertexClient"
- `<nz-content>` - Área de contenido con `<router-outlet>`
- `<nz-footer>` - Footer con copyright

---

## 📄 Páginas Implementadas

### 1. **Landing Page** (`/`)
**Componentes Ng-Zorro usados:**
- `NzButtonModule` - Botón CTA "Comenzar Ahora"
- `NzGridModule` - Grid responsive (3 columnas)
- `NzCardModule` - Cards de características
- `NzTypographyModule` - Tipografía

**Funcionalidad:**
- Hero section con título y CTA
- 3 cards con características
- Botón redirige a `/login`

### 2. **Login** (`/login`)
**Componentes Ng-Zorro usados:**
- `NzFormModule` - Formulario reactivo
- `NzInputModule` - Inputs de email y password
- `NzButtonModule` - Botón de submit
- `NzCardModule` - Card contenedor
- `NzAlertModule` - Alertas de error
- `NzIconModule` - Iconos (mail, lock)

**Integración API:**
- Endpoint: `POST /api/auth/login`
- Payload: `{ email: string, password: string }`
- Response: `{ token: string }`
- Al éxito: Guarda token → Redirige a `/onboarding`

### 3. **Onboarding** (`/onboarding`)
**Componentes Ng-Zorro usados:**
- `NzStepsModule` - Barra de pasos (1, 2, 3)
- `NzFormModule` - Formularios reactivos
- `NzInputModule` - Campos de texto
- `NzSelectModule` - Selectores dropdown
- `NzButtonModule` - Botones de navegación
- `NzResultModule` - Pantalla de éxito
- `NzMessageService` - Notificaciones toast

**Integración API:**

#### GET /api/onboarding/resume (Al cargar)
- Response: `{ currentStep: number, serializedData: string, isCompleted: boolean }`
- Deserializa `serializedData` y rellena formularios
- Setea el paso activo

#### POST /api/onboarding/save (Al navegar)
- Payload: `{ currentStep: number, serializedData: string }`
- **IMPORTANTE:** `serializedData` es `JSON.stringify(formData)` (string, NO objeto)

**Flujo de Usuario:**
1. Carga estado guardado al iniciar
2. **Paso 1:** Información Personal (nombre, apellido, teléfono)
3. **Paso 2:** Información Profesional (título, empresa, experiencia)
4. **Paso 3:** Preferencias (departamento, intereses, disponibilidad)
5. Al dar "Siguiente" → Guarda con POST
6. Al "Finalizar" → Muestra pantalla de éxito con `nz-result`

---

## 🔒 Autenticación

### Guard: `authGuard`
```typescript
// Functional Guard (Angular 21)
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');
  
  if (token) return true;
  return router.createUrlTree(['/login']);
};
```

### Flujo de Auth:
1. Login exitoso → `localStorage.setItem('authToken', token)`
2. Ruta protegida → `authGuard` verifica token
3. Logout → `localStorage.removeItem('authToken')`

---

## 🎯 Contratos de API (Estrictos)

### Auth
```typescript
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string }
```

### Onboarding
```typescript
GET /api/onboarding/resume
Headers: Authorization: Bearer <TOKEN>
Response: {
  currentStep: number,
  serializedData: string,  // JSON stringificado
  isCompleted: boolean
}

POST /api/onboarding/save
Headers: Authorization: Bearer <TOKEN>
Body: {
  currentStep: number,
  serializedData: string   // JSON.stringify(data) - NO objeto plano
}
```

---

## 🏃 Comandos para Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm start

# Build de producción
npm run build

# Tests
npm test
```

---

## 📦 Dependencias Ng-Zorro

Ya instaladas:
```json
{
  "ng-zorro-antd": "^19.x.x"
}
```

Módulos importados en componentes:
- `NzLayoutModule`
- `NzButtonModule`
- `NzStepsModule`
- `NzFormModule`
- `NzInputModule`
- `NzCardModule`
- `NzGridModule`
- `NzSelectModule`
- `NzResultModule`
- `NzAlertModule`
- `NzIconModule`
- `NzMessageService`

---

## 🎨 Iconos Configurados

En `app.config.ts`:
```typescript
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  UserOutline,
  LockOutline,
  MailOutline,
  CheckCircleOutline,
  HomeOutline,
  LogoutOutline
} from '@ant-design/icons-angular/icons';
```

Uso en templates:
```html
<span nz-icon nzType="mail" nzTheme="outline"></span>
```

---

## 🔧 Próximos Pasos Sugeridos

1. **Crear Interceptor HTTP:**
   - Agregar automáticamente el token `Authorization: Bearer <TOKEN>`
   - Manejar errores 401 (redirigir a login)

2. **Integrar NgRx Signals:**
   - Estado centralizado para onboarding
   - Actions: `loadResume`, `saveProgress`, `completeOnboarding`

3. **Validaciones Avanzadas:**
   - Validadores custom para formularios
   - Mensajes de error más específicos

4. **Testing:**
   - Unit tests para componentes
   - Integration tests para flujos

5. **Proxy Configuration:**
   - Crear `proxy.conf.json` para desarrollo local
   ```json
   {
     "/api": {
       "target": "http://localhost:3000",
       "secure": false
     }
   }
   ```

---

## 📝 Notas Importantes

### ⚠️ Serialización de Datos
El backend espera `serializedData` como **STRING**, NO como objeto:
```typescript
// ❌ INCORRECTO
{ serializedData: { name: "John" } }

// ✅ CORRECTO
{ serializedData: JSON.stringify({ name: "John" }) }
```

### 🔐 Token Management
El token se almacena en `localStorage` con key `authToken`:
```typescript
// Guardar
localStorage.setItem('authToken', token);

// Recuperar
const token = localStorage.getItem('authToken');

// Eliminar
localStorage.removeItem('authToken');
```

### 🎯 Standalone Components
Todos los componentes son standalone (Angular 21):
```typescript
@Component({
  selector: 'app-ejemplo',
  imports: [NzButtonModule, ReactiveFormsModule],  // Importar directamente
  templateUrl: './ejemplo.component.html'
})
export class EjemploComponent {}
```

---

## 🎉 Resultado Final

- ✅ Routing completo con lazy loading
- ✅ Layout profesional con Ng-Zorro
- ✅ Landing page atractiva
- ✅ Login con validación y manejo de errores
- ✅ Onboarding con 3 pasos usando `nz-steps`
- ✅ Guard funcional para rutas protegidas
- ✅ Integración API con contratos estrictos
- ✅ Signals para estado local
- ✅ Formularios reactivos con validación
- ✅ UI/UX profesional con Ant Design

---

**Autor:** GitHub Copilot  
**Stack:** Angular 21 + Ng-Zorro + TypeScript  
**Fecha:** Enero 2026
