import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { GeminiService } from '../../services/gemini.service'; 
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; 

@Component({
  selector: 'app-landing',
  standalone: true,
  
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, FormsModule], 
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  
  
  private platformId: Object = inject(PLATFORM_ID);
  
  
  private geminiService = inject(GeminiService);
  private sanitizer = inject(DomSanitizer);

  
  userAssessment: string = '';
  aiRecommendation: SafeHtml | null = null; 
  isLoading: boolean = false;
  error: string | null = null;

  
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
    if (isPlatformBrowser(this.platformId)) {
      this.initIntersectionObserver();
    }
  }
  
  initIntersectionObserver(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    setTimeout(() => {
      document.querySelectorAll('.feature-card, .step-card').forEach(el => {
        observer.observe(el);
      });
    }, 100);
  }

  
  submitAssessment(): void {
    if (!this.userAssessment.trim()) {
      this.error = 'Please enter your mental state assessment.';
      return;
    }

    this.isLoading = true;
    this.aiRecommendation = null;
    this.error = null;

    this.geminiService.generateRecommendation(this.userAssessment)
      .subscribe({
        next: (response: string) => {
          
          this.aiRecommendation = this.sanitizer.bypassSecurityTrustHtml(response.replace(/\n/g, '<br>'));
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Gemini API Error:", err);
          this.error = 'An error occurred while contacting the AI. Check your API key and console.';
          this.isLoading = false;
        }
      });
  }
}