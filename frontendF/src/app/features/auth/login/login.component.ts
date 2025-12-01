import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  
  loginForm: FormGroup;
  showPassword = false;

  // Use signals from auth service
  loading = this.authService.isLoading;
  error = this.authService.error;

  constructor() {
    // Remove all arguments from the constructor
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    // Clear error when component loads
    this.authService.error.set(null);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: () => {
          // Navigation is handled by auth intent in auth service
          // Intent will automatically navigate based on user role
        },
        error: (err) => {
          // Error is already set in auth service signal
          // Additional error handling if needed
          console.error('Login error:', err);
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  loginWithGoogle(): void {
    // Implement Google OAuth
    this.authService.error.set('Google login not yet implemented');
  }

  loginWithFacebook(): void {
    // Implement Facebook OAuth
    this.authService.error.set('Facebook login not yet implemented');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
