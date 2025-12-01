import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimerService, TimerState, TimerConfig } from '../../../core/services/timer.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timers',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.scss']
})
export class TimersComponent implements OnInit, OnDestroy {
  timerState: TimerState | null = null;
  presetConfigs: TimerConfig[] = [];
  customConfig: TimerConfig = { workDuration: 25, breakDuration: 5, sessions: 4 };
  showCustomForm = false;
  private subscription?: Subscription;

  constructor(private timerService: TimerService) {}

  ngOnInit(): void {
    this.presetConfigs = this.timerService.getPresetConfigs();
    this.subscription = this.timerService.timerState$.subscribe(state => {
      this.timerState = state;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  startTimer(config: TimerConfig): void {
    this.timerService.startTimer(config);
  }

  pauseTimer(): void {
    this.timerService.pauseTimer();
  }

  resumeTimer(): void {
    this.timerService.resumeTimer();
  }

  resetTimer(): void {
    this.timerService.resetTimer();
  }

  skipBreak(): void {
    this.timerService.skipBreak();
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getProgress(): number {
    if (!this.timerState) return 0;
    const total = this.timerState.isBreak 
      ? this.timerState.config.breakDuration * 60
      : this.timerState.config.workDuration * 60;
    return ((total - this.timerState.timeRemaining) / total) * 100;
  }

  getPresetName(config: TimerConfig): string {
    if (config.workDuration === 25 && config.breakDuration === 5) return 'Pomodoro Classic';
    if (config.workDuration === 50 && config.breakDuration === 10) return 'Study Timer';
    if (config.workDuration === 15 && config.breakDuration === 3) return 'Short Focus';
    if (config.workDuration === 90 && config.breakDuration === 20) return 'Deep Work';
    return 'Custom Timer';
  }

  createCustomTimer(): void {
    if (this.customConfig.workDuration > 0 && this.customConfig.breakDuration > 0 && this.customConfig.sessions > 0) {
      this.startTimer(this.customConfig);
      this.showCustomForm = false;
    }
  }
}
