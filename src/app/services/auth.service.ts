import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../core/services/error-handler.service';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ApiResponse,
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UserInfo
} from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

  // URL base del API (desde environment)
  private readonly API_URL = `${environment.apiUrl}/auth`;

  // Estado de autenticación con Signals
  private readonly TOKEN_KEY = environment.tokenKey;
  private readonly USER_KEY = environment.userKey;

  // Signal para indicar si el usuario está autenticado
  isAuthenticated = signal<boolean>(this.hasValidToken());

  // BehaviorSubject para el usuario actual (compatible con RxJS)
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(this.getUserInfo());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Verificar token al inicializar el servicio
    this.checkTokenExpiration();
  }

  /**
   * Registra un nuevo usuario en el sistema
   * POST /api/auth/register
   */
  register(dto: RegisterDto): Observable<AuthResponseDto> {
    return this.http.post<ApiResponse<AuthResponseDto>>(`${this.API_URL}/register`, dto)
      .pipe(
        map(response => this.handleAuthResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Inicia sesión en el sistema
   * POST /api/auth/login
   */
  login(dto: LoginDto): Observable<AuthResponseDto> {
    return this.http.post<ApiResponse<AuthResponseDto>>(`${this.API_URL}/login`, dto)
      .pipe(
        map(response => this.handleAuthResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Cierra la sesión del usuario
   * Limpia el token y redirige al login
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticated.set(false);
    this.currentUserSubject.next(null);
    // Navegación controlada por el efecto de NgRx, no forzar recarga
  }

  /**
   * Obtiene el token JWT almacenado
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtiene la información del usuario almacenada
   */
  getUserInfo(): UserInfo | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Verifica si hay un token válido almacenado
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const userInfo = this.getUserInfo();
    if (!userInfo) return false;

    // Verificar si el token ha expirado
    const expiresAt = new Date(userInfo.expiresAt);
    const now = new Date();
    return now < expiresAt;
  }

  /**
   * Verifica la expiración del token y hace logout si es necesario
   */
  private checkTokenExpiration(): void {
    if (!this.hasValidToken()) {
      this.logout();
    }
  }

  /**
   * Maneja la respuesta de autenticación (login/register)
   * Almacena el token y actualiza el estado
   */
  private handleAuthResponse(response: ApiResponse<AuthResponseDto>): AuthResponseDto {
    if (response.success && response.data) {
      const authData = response.data;

      // Almacenar token
      localStorage.setItem(this.TOKEN_KEY, authData.token);

      // Almacenar información del usuario
      const userInfo: UserInfo = {
        email: authData.email,
        fullName: authData.fullName,
        token: authData.token,
        expiresAt: authData.expiresAt
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));

      // Actualizar estado
      this.isAuthenticated.set(true);
      this.currentUserSubject.next(userInfo);

      return authData;
    } else {
      // Si la respuesta no es exitosa, lanzar error con los mensajes
      const errorMessage = response.errors.length > 0 
        ? response.errors.join(', ') 
        : response.message;
      throw new Error(errorMessage);
    }
  }

  /**
   * Maneja errores HTTP usando el servicio centralizado
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    return this.errorHandler.handleError(error);
  }

  /**
   * Verifica si el token está cerca de expirar (útil para refresh)
   * @param minutesBefore Minutos antes de la expiración
   */
  isTokenExpiringSoon(minutesBefore: number = 5): boolean {
    const userInfo = this.getUserInfo();
    if (!userInfo) return false;

    const expiresAt = new Date(userInfo.expiresAt);
    const now = new Date();
    const diffMinutes = (expiresAt.getTime() - now.getTime()) / (1000 * 60);

    return diffMinutes <= minutesBefore && diffMinutes > 0;
  }
}
