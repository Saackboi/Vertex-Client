import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { provideNzConfig } from 'ng-zorro-antd/core/config';

import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// Iconos registrados (centralizados)
// Core iconos globales (mínimos)
// Import iconos específicos que vamos a usar
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  UserOutline,
  LockOutline,
  MailOutline,
  CheckCircleOutline,
  CheckCircleFill,
  HomeOutline,
  LogoutOutline,
  RocketOutline,
  GoogleOutline,
  BulbOutline,
  GlobalOutline,
  TeamOutline,
  BellOutline,
  SaveOutline,
  LayoutOutline,
  SafetyOutline,
  ArrowRightOutline,
  SunOutline,
  MoonOutline,
  ArrowLeftOutline,
  InfoCircleOutline,
  ExclamationCircleOutline,
  CloseCircleOutline,
  CheckOutline,
  DeleteOutline,
  PlusOutline,
  IdcardOutline,
  SolutionOutline,
  TagsOutline,
  EditOutline,
  CalendarOutline,
  ExclamationCircleFill
} from '@ant-design/icons-angular/icons';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { authReducer } from './store/auth/auth.reducer';
import { onboardingReducer } from './store/onboarding/onboarding.reducer';
import { notificationsReducer } from './store/notifications/notifications.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { OnboardingEffects } from './store/onboarding/onboarding.effects';
import { NotificationsEffects } from './store/notifications/notifications.effects';
import { OnboardingGlobalEffects } from './store/onboarding/onboarding.global.effects';

const icons = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  UserOutline,
  LockOutline,
  MailOutline,
  CheckCircleOutline,
  CheckCircleFill,
  HomeOutline,
  LogoutOutline,
  RocketOutline,
  GoogleOutline,
  BulbOutline,
  GlobalOutline,
  TeamOutline,
  BellOutline,
  SaveOutline,
  LayoutOutline,
  SafetyOutline,
  ArrowRightOutline,
  SunOutline,
  MoonOutline,
  ArrowLeftOutline,
  InfoCircleOutline,
  ExclamationCircleOutline,
  CloseCircleOutline,
  CheckOutline,
  DeleteOutline,
  PlusOutline,
  IdcardOutline,
  SolutionOutline,
  TagsOutline,
  EditOutline,
  CalendarOutline,
  ExclamationCircleFill
];
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNzIcons(icons),
    provideNzI18n(es_ES),
    provideNzConfig({
      theme: {
        primaryColor: '#43A047'
      }
    }),
    provideStore({
      auth: authReducer,
      onboarding: onboardingReducer,
      notifications: notificationsReducer
    }),
    provideEffects([AuthEffects, OnboardingEffects, NotificationsEffects, OnboardingGlobalEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
};
