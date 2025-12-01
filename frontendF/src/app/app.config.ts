import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http'; // <-- 'withFetch' imported here
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { jwtInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // FIX: Added withFetch() for SSR compatibility and performance
    provideHttpClient(
      withInterceptors([jwtInterceptor]),
      withFetch() 
    ),
    provideAnimations(),
    provideClientHydration(withEventReplay())
  ]
};