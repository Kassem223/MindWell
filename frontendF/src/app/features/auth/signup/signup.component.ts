import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

// Custom validator function for password confirmation
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

// Custom validator function for password strength
function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasMinLength = value.length >= 8;

  // Check how many criteria are met
  const strength = [hasUpperCase, hasLowerCase, hasNumber, hasMinLength].filter(Boolean).length;

  if (strength < 2) {
    return { weakPassword: true };
  }
  
  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  
  // Dependency Injection using inject() - FIX for TS2729 error
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  
  signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  
  // Use signals from auth service (now safe to access)
  loading = this.authService.isLoading;
  error = this.authService.error;

  // The constructor is now clean and only handles form initialization
  constructor() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      // Note: Added Validators.minLength(8) recommendation for strength display logic
      password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: passwordMatchValidator });

    // Clear error when component loads
    this.authService.error.set(null);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // --- Password Strength Display Logic (Used in HTML) ---
  getPasswordStrength(): 'weak' | 'medium' | 'strong' {
    const password = this.password?.value || '';
    if (password.length === 0) return 'weak';

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinLength = password.length >= 8;

    const strength = [hasUpperCase, hasLowerCase, hasNumber, hasMinLength].filter(Boolean).length;

    if (strength <= 2) return 'weak';
    if (strength === 3) return 'medium';
    return 'strong';
  }

  getPasswordStrengthPercentage(): number {
    const strength = this.getPasswordStrength();
    if (strength === 'weak') return 33;
    if (strength === 'medium') return 66;
    return 100;
  }

  hasMinLength(): boolean {
    const password = this.password?.value || '';
    return password.length >= 8;
  }

  hasUpperCase(): boolean {
    const password = this.password?.value || '';
    return /[A-Z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.password?.value || '';
    return /[0-9]/.test(password);
  }
  // --- End Password Strength Display Logic ---

  onSubmit(): void {
    // Manually trigger validation on confirmPassword to check passwordMatchValidator
    this.confirmPassword?.updateValueAndValidity();
    
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;

      this.authService.register({ name, email, password }).subscribe({
        next: () => {
          // Registration successful - redirect to login page
          this.router.navigate(['/login'], { 
            queryParams: { registered: 'true' } 
          });
        },
        error: (err) => {
          // Error is already set in auth service signal
          console.error('Registration error:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  signupWithGoogle(): void {
    this.authService.error.set('Google signup not yet implemented');
  }

  signupWithFacebook(): void {
    this.authService.error.set('Facebook signup not yet implemented');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  get name() {
    return this.signupForm.get('name');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  get acceptTerms() {
    return this.signupForm.get('acceptTerms');
  }
}