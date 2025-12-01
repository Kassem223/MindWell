import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MoodService } from '../../../core/services/mood.service';
import { TipsService } from '../../../core/services/tips.service';
import { User } from '../../../core/models/user.model';
import { Mood } from '../../../core/models/mood.model';
import { Tip } from '../../../core/models/tip.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  // Use inject() to get services
  private authService: AuthService = inject(AuthService);
  private moodService: MoodService = inject(MoodService);
  private tipsService: TipsService = inject(TipsService);
  
  // FIX: Expose the signal directly to the template, replacing the old property.
  currentUser = this.authService.currentUser;
  
  recentMoods: Mood[] = [];
  dailyTip: Tip | null = null;
  moodStreak = 0;
  loading = true;

  quickActions = [
    { icon: '😊', title: 'Log Your Mood', route: '/mood', color: 'primary' },
    { icon: '💡', title: 'Browse Tips', route: '/tips', color: 'secondary' },
    { icon: '⏱️', title: 'Start Timer', route: '/timers', color: 'accent' },
    { icon: '👨‍⚕️', title: 'Find a Psychologist', route: '/psychologists', color: 'primary' }
  ];

  // Constructor is now empty as dependencies are injected
  constructor() {}

  ngOnInit(): void {
    // FIX: The old subscription has been removed.
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load recent moods
    this.moodService.getMoods().subscribe({
      next: (moods) => {
        this.recentMoods = moods.slice(0, 5);
        this.calculateMoodStreak(moods);
      },
      error: (err) => console.error('Error loading moods:', err)
    });

    // Load daily tip
    this.tipsService.getTips().subscribe({
      next: (tips) => {
        if (tips.length > 0) {
          this.dailyTip = tips[Math.floor(Math.random() * tips.length)];
        }
      },
      error: (err) => console.error('Error loading tips:', err)
    });

    this.loading = false;
  }

  calculateMoodStreak(moods: Mood[]): void {
    if (moods.length === 0) {
      this.moodStreak = 0;
      return;
    }

    // Sort by date descending
    const sortedMoods = [...moods].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedMoods.length; i++) {
      const moodDate = new Date(sortedMoods[i].createdAt);
      moodDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - moodDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }

    this.moodStreak = streak;
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getEmotionIcon(emotion: string): string {
    const icons: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      calm: '😌',
      stressed: '😤',
      excited: '🤩',
      tired: '😴',
      angry: '😠'
    };
    return icons[emotion] || '😊';
  }
}