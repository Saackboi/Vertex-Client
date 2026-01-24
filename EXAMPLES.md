# 📘 Ejemplos de Uso - VertexClient

## 🎯 Cómo Extender la Aplicación

### 1. Agregar un Nuevo Componente de Ng-Zorro

```typescript
// ejemplo.component.ts
import { Component } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-ejemplo',
  imports: [NzTagModule, NzBadgeModule],  // ⚠️ Importar módulos en standalone
  template: `
    <nz-badge [nzCount]="5">
      <nz-tag nzColor="blue">Nuevo</nz-tag>
    </nz-badge>
  `
})
export class EjemploComponent {}
```

**Recordar:** En Angular 21 standalone, importar módulos directamente en `imports: []`

---

### 2. Crear un Servicio para API

```typescript
// services/user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users';

  // El interceptor agregará automáticamente el token Bearer
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

**Uso en componente:**
```typescript
export class MiComponente {
  private userService = inject(UserService);
  users = signal<User[]>([]);

  ngOnInit() {
    this.userService.getUsers().subscribe(
      users => this.users.set(users)
    );
  }
}
```

---

### 3. Agregar una Nueva Ruta Protegida

```typescript
// app.routes.ts
export const routes: Routes = [
  // ... rutas existentes
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard],  // ✅ Protegida
    title: 'VertexClient - Dashboard'
  }
];
```

---

### 4. Usar Signals para Estado Local

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-contador',
  template: `
    <div>
      <p>Contador: {{ contador() }}</p>
      <p>Doble: {{ doble() }}</p>
      <button (click)="incrementar()">+</button>
      <button (click)="decrementar()">-</button>
    </div>
  `
})
export class ContadorComponent {
  // Signal writable
  contador = signal(0);
  
  // Signal computed (calculado automáticamente)
  doble = computed(() => this.contador() * 2);

  incrementar() {
    this.contador.update(val => val + 1);
  }

  decrementar() {
    this.contador.set(Math.max(0, this.contador() - 1));
  }
}
```

---

### 5. Formulario Reactivo Avanzado con Ng-Zorro

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'app-formulario-avanzado',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzSwitchModule
  ],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
      <!-- Input con validación -->
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>Nombre</nz-form-label>
        <nz-form-control 
          [nzSpan]="14"
          [nzErrorTip]="nombreError">
          <input nz-input formControlName="nombre" />
        </nz-form-control>
      </nz-form-item>

      <!-- Date Picker -->
      <nz-form-item>
        <nz-form-label [nzSpan]="6">Fecha</nz-form-label>
        <nz-form-control [nzSpan]="14">
          <nz-date-picker formControlName="fecha"></nz-date-picker>
        </nz-form-control>
      </nz-form-item>

      <!-- Switch -->
      <nz-form-item>
        <nz-form-label [nzSpan]="6">Activo</nz-form-label>
        <nz-form-control [nzSpan]="14">
          <nz-switch formControlName="activo"></nz-switch>
        </nz-form-control>
      </nz-form-item>

      <!-- Botones -->
      <nz-form-item>
        <nz-form-control [nzOffset]="6" [nzSpan]="14">
          <button nz-button nzType="primary" [disabled]="!form.valid">
            Guardar
          </button>
          <button nz-button type="button" (click)="reset()">
            Reset
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>

    <ng-template #nombreError let-control>
      <ng-container *ngIf="control.hasError('required')">
        El nombre es requerido
      </ng-container>
      <ng-container *ngIf="control.hasError('minlength')">
        Mínimo 3 caracteres
      </ng-container>
    </ng-template>
  `
})
export class FormularioAvanzadoComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fecha: [null],
      activo: [true]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

  reset() {
    this.form.reset({ activo: true });
  }
}
```

---

### 6. Tabla con Ng-Zorro

```typescript
import { Component, signal } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-user-table',
  imports: [NzTableModule, NzButtonModule],
  template: `
    <nz-table #basicTable [nzData]="users()">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of basicTable.data">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <nz-tag [nzColor]="user.status === 'active' ? 'green' : 'red'">
              {{ user.status }}
            </nz-tag>
          </td>
          <td>
            <button nz-button nzType="link" (click)="edit(user)">
              Editar
            </button>
            <button nz-button nzType="link" nzDanger (click)="delete(user.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </nz-table>
  `
})
export class UserTableComponent {
  users = signal<User[]>([
    { id: 1, name: 'John', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane', email: 'jane@example.com', status: 'inactive' }
  ]);

  edit(user: User) {
    console.log('Editar:', user);
  }

  delete(id: number) {
    this.users.update(users => users.filter(u => u.id !== id));
  }
}
```

---

### 7. Modal con Ng-Zorro

```typescript
import { Component, inject } from '@angular/core';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-modal-example',
  imports: [NzModalModule, NzButtonModule],
  template: `
    <button nz-button nzType="primary" (click)="showModal()">
      Abrir Modal
    </button>
  `
})
export class ModalExampleComponent {
  private modal = inject(NzModalService);

  showModal() {
    this.modal.confirm({
      nzTitle: '¿Estás seguro?',
      nzContent: 'Esta acción no se puede deshacer',
      nzOkText: 'Sí, continuar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        console.log('Usuario confirmó');
        return new Promise((resolve) => {
          setTimeout(() => resolve(true), 1000);
        });
      }
    });
  }

  showCustomModal() {
    this.modal.create({
      nzTitle: 'Modal Personalizado',
      nzContent: ModalContentComponent,  // Componente custom
      nzFooter: null,
      nzWidth: 600
    });
  }
}

// Componente para el contenido del modal
@Component({
  selector: 'app-modal-content',
  template: `
    <div>
      <p>Contenido personalizado del modal</p>
    </div>
  `
})
export class ModalContentComponent {}
```

---

### 8. Notificaciones y Mensajes

```typescript
import { Component, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-notifications',
  imports: [NzButtonModule],
  providers: [NzMessageService, NzNotificationService],
  template: `
    <button nz-button (click)="showSuccess()">Success</button>
    <button nz-button (click)="showError()">Error</button>
    <button nz-button (click)="showNotification()">Notification</button>
  `
})
export class NotificationsComponent {
  private message = inject(NzMessageService);
  private notification = inject(NzNotificationService);

  showSuccess() {
    this.message.success('¡Operación exitosa!');
  }

  showError() {
    this.message.error('Ocurrió un error');
  }

  showNotification() {
    this.notification.create(
      'info',
      'Notificación',
      'Este es el contenido de la notificación',
      { nzDuration: 3000 }
    );
  }
}
```

---

### 9. Upload de Archivos

```typescript
import { Component } from '@angular/core';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-upload',
  imports: [NzUploadModule, NzButtonModule, NzIconModule],
  template: `
    <nz-upload
      nzAction="/api/upload"
      [nzHeaders]="{ Authorization: 'Bearer ' + getToken() }"
      [nzFileList]="fileList"
      (nzChange)="handleChange($event)">
      <button nz-button>
        <span nz-icon nzType="upload"></span>
        Seleccionar Archivo
      </button>
    </nz-upload>
  `
})
export class UploadComponent {
  fileList: NzUploadFile[] = [];

  getToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  handleChange(info: any): void {
    if (info.file.status === 'done') {
      console.log('Upload exitoso:', info.file.response);
    } else if (info.file.status === 'error') {
      console.error('Error en upload:', info.file.error);
    }
  }
}
```

---

### 10. Guard con Lógica Avanzada

```typescript
// guards/role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const userService = inject(UserService);

    return userService.getCurrentUser().pipe(
      map(user => {
        if (user && allowedRoles.includes(user.role)) {
          return true;
        }
        return router.createUrlTree(['/unauthorized']);
      })
    );
  };
};

// Uso en routes:
{
  path: 'admin',
  loadComponent: () => import('./pages/admin/admin.component'),
  canActivate: [authGuard, roleGuard(['admin', 'superadmin'])]
}
```

---

## 🎨 Tema Personalizado

```typescript
// app.config.ts
provideNzConfig({
  theme: {
    primaryColor: '#1890ff',
    successColor: '#52c41a',
    warningColor: '#faad14',
    errorColor: '#f5222d',
    infoColor: '#1890ff'
  }
})
```

---

## 📚 Recursos Adicionales

- **Ng-Zorro Docs:** https://ng.ant.design/
- **Angular Docs:** https://angular.dev/
- **RxJS:** https://rxjs.dev/

---

**Última actualización:** Enero 2026
