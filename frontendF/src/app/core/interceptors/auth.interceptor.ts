import { inject, Injector } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Functional Interceptor to add a JWT token to outgoing requests.
 * Uses Injector to lazily retrieve AuthService to prevent circular dependency.
 * (AuthService -> HttpClient -> Interceptor -> AuthService)
 */
export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  // 1. Inject the Injector, not the AuthService directly.
  const injector = inject(Injector);

  // 2. Lazily retrieve the AuthService *inside* the interceptor function body.
  // This avoids the circular dependency during module/provider initialization.
  const authService = injector.get(AuthService);

  const authToken = authService.getToken();

  // Clone the request and add the token if it exists
  if (authToken) {
    req = req.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${authToken}`
      })
    });
  }

  return next(req);
};