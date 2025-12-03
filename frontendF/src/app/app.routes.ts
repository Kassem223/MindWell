import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'tips',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/tips/tips.component').then(m => m.TipsComponent)
  },
  {
    path: 'timers',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/timers/timers.component').then(m => m.TimersComponent)
  },
  {
    path: 'psychologists',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/psychologists/psychologists.component').then(m => m.PsychologistsComponent)
  },
  {
    path: 'psychologists/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/psychologists/detail/detail.component').then(m => m.PsychologistDetailComponent)
  },
  {
    path: 'mood',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/mood/mood.component').then(m => m.MoodComponent)
  },
  {
    path: 'wellness',
    canActivate: [authGuard],
    loadComponent: () => import('./features/wellness/wellness.component').then(m => m.WellnessComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'psychologists',
        loadComponent: () => import('./features/admin/psychologist-management/psychologist-management.component').then(m => m.PsychologistManagementComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
