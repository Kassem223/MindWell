import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalUsers: 1250,
    totalMoodEntries: 5432,
    totalTips: 45,
    totalPsychologists: 12
  };

  recentActivity = [
    { type: 'user', message: 'New user registered: john@example.com', time: '2 hours ago' },
    { type: 'mood', message: 'New mood entry logged', time: '3 hours ago' },
    { type: 'user', message: 'New user registered: jane@example.com', time: '5 hours ago' }
  ];

  ngOnInit(): void {
    // Load admin stats
  }
}
