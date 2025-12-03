import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AuthService } from '../../../core/services/auth.service';
import { MoodService } from '../../../core/services/mood.service';
import { User } from '../../../core/models/user.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalMoodEntries: 0,
    totalTips: 0,
    totalPsychologists: 0
  };

  users: User[] = [];
  editingUser: User | null = null;
  editForm: Partial<User> = {};

  recentActivity = [
    { type: 'user', message: 'New user registered: john@example.com', time: '2 hours ago' },
    { type: 'mood', message: 'New mood entry logged', time: '3 hours ago' },
    { type: 'user', message: 'New user registered: jane@example.com', time: '5 hours ago' }
  ];

  constructor(
    private authService: AuthService,
    private moodService: MoodService
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Generate random numbers for tips and psychologists
    this.stats.totalTips = Math.floor(Math.random() * 50) + 20;
    this.stats.totalPsychologists = Math.floor(Math.random() * 15) + 5;

    // Load real stats from backend
    forkJoin({
      users: this.authService.getAllUsers().pipe(
        catchError(err => {
          console.error('❌ Failed to fetch users:', err.status, err.error);
          return of([]);
        })
      ),
      moods: this.moodService.getMoods().pipe(
        catchError(err => {
          console.error('❌ Failed to fetch moods:', err.status, err.error);
          return of([]);
        })
      )
    }).subscribe({
      next: (data) => {
        this.users = data.users;
        this.stats.totalUsers = data.users.length;
        this.stats.totalMoodEntries = data.moods.length;

        console.log('✅ Stats loaded:', this.stats);
        console.log('✅ Users:', this.users);
      },
      error: (err) => {
        console.error('❌ Critical error loading dashboard stats', err);
      }
    });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          this.stats.totalUsers--;
          console.log('✅ User deleted successfully');
        },
        error: (err) => console.error('❌ Failed to delete user:', err)
      });
    }
  }

  startEdit(user: User): void {
    this.editingUser = user;
    this.editForm = { ...user };
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.editForm = {};
  }

  saveEdit(): void {
    if (this.editingUser && this.editingUser.id) {
      this.authService.updateUser(this.editingUser.id, this.editForm).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.editingUser = null;
          this.editForm = {};
          console.log('✅ User updated successfully');
        },
        error: (err) => console.error('❌ Failed to update user:', err)
      });
    }
  }
}
