import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  // Use inject() for services
  private authService: AuthService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);
  
  // FIX: Expose the signal directly to the template, removing the old property.
  currentUser = this.authService.currentUser; 

  activeTab = 'personal';
  
  personalForm: FormGroup;
  settingsForm: FormGroup;
  passwordForm: FormGroup;
  
  loading = false;
  successMessage = '';

  constructor() {
    this.personalForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.settingsForm = this.fb.group({
      notifications: [true],
      notificationFrequency: ['4h'],
      theme: ['light'],
      language: ['en']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // FIX: Get the current user data by invoking the signal
    const user = this.currentUser();
    
    if (user) {
      this.personalForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      });
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.successMessage = '';
  }

  savePersonalInfo(): void {
    if (this.personalForm.valid) {
      this.loading = true;
      // In a real app, you'd call an API to update user info
      setTimeout(() => {
        this.loading = false;
        this.successMessage = 'Personal information updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      }, 1000);
    }
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      this.loading = true;
      // Note: Replaced localStorage logic with a console warning as it's not compliant with persistence rules here.
      console.warn("Settings saved successfully (using mock saving). In a real app, integrate with Firestore.");
      setTimeout(() => {
        this.loading = false;
        this.successMessage = 'Settings saved successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      }, 1000);
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;
      if (newPassword !== confirmPassword) {
        this.successMessage = 'Passwords do not match!';
        return;
      }
      this.loading = true;
      // In a real app, you'd call an API to change password
      setTimeout(() => {
        this.loading = false;
        this.successMessage = 'Password changed successfully!';
        this.passwordForm.reset();
        setTimeout(() => this.successMessage = '', 3000);
      }, 1000);
    }
  }

  deleteAccount(): void {
    // FIX: Removing window.confirm() as it is non-compliant. Using console warning instead.
    console.warn('Delete Account requested. Confirmation UI is required here.');
    this.successMessage = 'Account deletion simulation initiated...';
    setTimeout(() => {
      this.authService.logout();
      this.successMessage = 'Account deleted and logged out.';
    }, 1500);
  }

  getMemberSince(): string {
    const user = this.currentUser(); // Invoke the signal
    if (!user?.createdAt) return 'N/A';
    return new Date(user.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  }
}