import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map, switchMap } from 'rxjs';
import { User, LoginRequest, RegisterRequest, LoginResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

const API_URL = environment.apiUrl;
const AUTH_TOKEN_KEY = 'authToken';

// Navigation Intent Types
export type AuthIntent = 'login' | 'signup' | 'logout' | 'profile' | 'home' | 'admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // SSR Safety Checks
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Signals for reactive state management
  public currentUser = signal<User | null>(null);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);
  public authIntent = signal<AuthIntent | null>(null);

  // Computed signals
  public isAuthenticated = computed(() => !!this.currentUser());
  public isAdmin = computed(() => {
    const roles = this.currentUser()?.roles;
    return Array.isArray(roles) && roles.includes('ADMIN');
  });
  public token = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // FIX: Defer loading user from storage until the DI system is stable.
    // This breaks the synchronous cycle (AuthService constructor -> loadUserFromStorage 
    // -> getCurrentUser() -> HttpClient -> Interceptor -> AuthService)
    if (this.isBrowser) {
      setTimeout(() => {
        this.loadUserFromStorage();
      }, 0);
    }

    // Effect to handle navigation intents
    effect(() => {
      const intent = this.authIntent();
      if (intent) {
        this.handleAuthIntent(intent);
      }
    });
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        // Assuming response.token holds the JWT (common pattern)
        this.setToken(response.token);
        this.isLoading.set(false);
        this.error.set(null);

        // After successful login, fetch user info then navigate
        this.fetchUserInfoAndNavigate('login');
      }),
      catchError((error: HttpErrorResponse) => {
        this.isLoading.set(false);
        const errorMessage = this.getErrorMessage(error);
        this.error.set(errorMessage);
        return throwError(() => error);
      })
    );
  }

  register(data: RegisterRequest): Observable<void> {
    this.isLoading.set(true);
    this.error.set(null);

    // Chain registration with immediate login to acquire a token and trigger navigation.
    return this.http.post<void>(`${API_URL}/auth/register`, data).pipe(
      // The map converts the successful void response into the login observable
      switchMap(() => {
        const loginRequest: LoginRequest = {
          email: data.email,
          password: data.password
        };
        // Execute login to get the token and user info immediately
        return this.login(loginRequest);
      }),
      map(() => void 0), // Final map to keep the return type as Observable<void>
      tap(() => {
        // Navigation intent is already set within the chained this.login() call
        this.isLoading.set(false);
        this.error.set(null);
      }),
      catchError((error: HttpErrorResponse) => {
        this.isLoading.set(false);
        const errorMessage = this.getErrorMessage(error);
        this.error.set(errorMessage);
        return throwError(() => error);
      })
    );
  }

  loginWithGoogle(token: string): Observable<LoginResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<LoginResponse>(`${API_URL}/auth/google`, { token }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.isLoading.set(false);
        this.error.set(null);
        this.fetchUserInfoAndNavigate('login');
      }),
      catchError((error: HttpErrorResponse) => {
        this.isLoading.set(false);
        const errorMessage = this.getErrorMessage(error);
        this.error.set(errorMessage);
        return throwError(() => error);
      })
    );
  }

  loginWithFacebook(token: string): Observable<LoginResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<LoginResponse>(`${API_URL}/auth/facebook`, { token }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.isLoading.set(false);
        this.error.set(null);
        this.fetchUserInfoAndNavigate('login');
      }),
      catchError((error: HttpErrorResponse) => {
        this.isLoading.set(false);
        const errorMessage = this.getErrorMessage(error);
        this.error.set(errorMessage);
        return throwError(() => error);
      })
    );
  }

  getCurrentUser(): Observable<User> {
    this.isLoading.set(true);
    return this.http.get<User>(`${API_URL}/auth/me`).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.token.set(this.isBrowser ? localStorage.getItem(AUTH_TOKEN_KEY) : null);

        if (this.isBrowser) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        this.isLoading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.isLoading.set(false);
        // If token is invalid, logout
        if (error.status === 401) {
          this.logout();
        }
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.authIntent.set('logout');

    if (this.isBrowser) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem('user');
    }

    this.currentUser.set(null);
    this.token.set(null);
    this.error.set(null);
    this.router.navigate(['/login']);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/auth/users`);
  }

  updateUser(id: string, updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${API_URL}/auth/users/${id}`, updates);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/auth/users/${id}`);
  }

  getToken(): string | null {
    return this.token() || (this.isBrowser ? localStorage.getItem(AUTH_TOKEN_KEY) : null);
  }

  // Navigation intent handler
  private handleAuthIntent(intent: AuthIntent): void {
    const user = this.currentUser();

    switch (intent) {
      case 'login':
      case 'signup':
        if (user) {
          if ((user.roles || []).includes('ADMIN')) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        }
        break;
      case 'logout':
        break;
      case 'profile':
        if (user) {
          this.router.navigate(['/profile']);
        }
        break;
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'admin':
        if ((user?.roles || []).includes('ADMIN')) {
          this.router.navigate(['/admin/dashboard']);
        }
        break;
    }

    setTimeout(() => this.authIntent.set(null), 0);
  }

  // Helper method to set navigation intent
  setIntent(intent: AuthIntent): void {
    this.authIntent.set(intent);
  }

  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    this.token.set(token);
  }

  // FIX: Updated signature to accept any AuthIntent
  private fetchUserInfoAndNavigate(intent: AuthIntent): void {
    // Fetch user information after login/register, then navigate
    this.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        if (this.isBrowser) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Navigate after user is loaded
        this.authIntent.set(intent);
      },
      error: (error) => {
        console.error('Failed to fetch user info:', error);
        // If user fetch fails (e.g., token still valid but /me endpoint failed), still try to navigate
        this.authIntent.set(intent);
      }
    });
  }

  private loadUserFromStorage(): void {
    if (!this.isBrowser) return;

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userStr = localStorage.getItem('user');

    if (token) {
      this.token.set(token);

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          this.currentUser.set(user);
          // Verify token validity by calling /me
          // This must be done via subscribe/Promise.then/etc., as it is now deferred.
          this.getCurrentUser().subscribe({
            error: () => this.logout()
          });
        } catch (e) {
          // FIX: Using 'home' intent is now valid
          this.fetchUserInfoAndNavigate('home');
        }
      } else {
        // FIX: Using 'home' intent is now valid
        this.fetchUserInfoAndNavigate('home');
      }
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) {
      return error.error.message;
    }

    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Invalid email or password. Please try again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 409:
        return 'Email already in use. Please use a different email address.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }
}
