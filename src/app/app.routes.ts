import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { onboardingGuard } from './guards/onboarding.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'VertexClient - Bienvenido'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
    title: 'VertexClient - Iniciar Sesión'
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.component').then(m => m.OnboardingComponent),
    canActivate: [authGuard, onboardingGuard],
    title: 'VertexClient - Onboarding'
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [authGuard],
    title: 'VertexClient - Notificaciones'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    canActivate: [authGuard],
    title: 'VertexClient - Dashboard'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

