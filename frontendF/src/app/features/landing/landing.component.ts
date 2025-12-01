import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  
  // Inject PLATFORM_ID to determine if the code is running in a browser
  private platformId: Object = inject(PLATFORM_ID);
  
  features = [
    { icon: '🧠', title: 'Track Your Mood', description: 'Log and monitor your emotional state daily to understand patterns and trends' },
    { icon: '💡', title: 'Get Personalized Tips', description: 'Access expert mental health tips tailored to your needs' },
    { icon: '⏱️', title: 'Focus Timers', description: 'Use Pomodoro and study timers to improve productivity and focus' },
    { icon: '👨‍⚕️', title: 'Connect with Psychologists', description: 'Find and connect with licensed mental health professionals' },
    { icon: '📝', title: 'Journal Your Thoughts', description: 'Write down your thoughts and feelings in a private journal' },
    { icon: '📊', title: 'View Analytics', description: 'Track your progress with detailed mood and wellness analytics' }
  ];

  steps = [
    { number: 1, title: 'Sign Up', description: 'Create your free account in seconds' },
    { number: 2, title: 'Track Your Wellness', description: 'Start logging your mood and thoughts daily' },
    { number: 3, title: 'Improve Daily', description: 'Use insights and tips to enhance your mental health' }
  ];

  ngOnInit(): void {
    // FIX: Guard the IntersectionObserver instantiation to ensure it only runs in a browser environment.
    if (isPlatformBrowser(this.platformId)) {
      this.initIntersectionObserver();
    }
  }
  
  /**
   * Initializes the Intersection Observer for fade-in animations.
   * This logic must only run on the client (browser).
   */
  initIntersectionObserver(): void {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          // Optional: observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Use a small timeout to ensure elements are fully rendered before observing
    setTimeout(() => {
      document.querySelectorAll('.feature-card, .step-card').forEach(el => {
        observer.observe(el);
      });
    }, 100);
  }
}