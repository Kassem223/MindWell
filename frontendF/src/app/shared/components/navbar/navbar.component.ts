import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  // Inject services using inject()
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  
  // Inject platform info for SSR safety
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  // Use authService signals directly
  currentUser = this.authService.currentUser; // Signal
  isAdmin = this.authService.isAdmin; // Computed signal
  
  showMenu = false;
  scrolled = false;

  constructor() {} 

  ngOnInit(): void {
    // FIX: Guard browser-specific window access
    if (this.isBrowser) {
      window.addEventListener('scroll', () => {
        this.scrolled = window.scrollY > 10;
      });
    }
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  logout(): void {
    this.authService.logout();
  }
}