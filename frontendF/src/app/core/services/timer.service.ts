import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TimerConfig {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  sessions: number;
}

export interface TimerState {
  isRunning: boolean;
  isBreak: boolean;
  currentSession: number;
  timeRemaining: number; // in seconds
  config: TimerConfig;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timerStateSubject = new BehaviorSubject<TimerState | null>(null);
  public timerState$ = this.timerStateSubject.asObservable();

  private intervalId: any = null;
  private notificationPermission: NotificationPermission = 'default';

  constructor() {
    this.requestNotificationPermission();
  }

  startTimer(config: TimerConfig): void {
    const state: TimerState = {
      isRunning: true,
      isBreak: false,
      currentSession: 1,
      timeRemaining: config.workDuration * 60,
      config
    };
    this.timerStateSubject.next(state);
    this.startCountdown();
  }

  pauseTimer(): void {
    const state = this.timerStateSubject.value;
    if (state) {
      this.timerStateSubject.next({ ...state, isRunning: false });
      this.clearInterval();
    }
  }

  resumeTimer(): void {
    const state = this.timerStateSubject.value;
    if (state) {
      this.timerStateSubject.next({ ...state, isRunning: true });
      this.startCountdown();
    }
  }

  resetTimer(): void {
    this.clearInterval();
    this.timerStateSubject.next(null);
  }

  skipBreak(): void {
    const state = this.timerStateSubject.value;
    if (state && state.isBreak) {
      this.nextSession(state);
    }
  }

  private startCountdown(): void {
    this.clearInterval();
    this.intervalId = setInterval(() => {
      const state = this.timerStateSubject.value;
      if (!state || !state.isRunning) {
        this.clearInterval();
        return;
      }

      if (state.timeRemaining > 0) {
        this.timerStateSubject.next({
          ...state,
          timeRemaining: state.timeRemaining - 1
        });
      } else {
        this.handleTimerComplete(state);
      }
    }, 1000);
  }

  private handleTimerComplete(state: TimerState): void {
    if (state.isBreak) {
      this.nextSession(state);
    } else {
      // Work session complete, start break
      if (state.currentSession < state.config.sessions) {
        this.timerStateSubject.next({
          ...state,
          isBreak: true,
          timeRemaining: state.config.breakDuration * 60,
          isRunning: true
        });
        this.showNotification('Break Time!', 'Take a well-deserved break.');
      } else {
        // All sessions complete
        this.showNotification('All Sessions Complete!', 'Great job staying focused!');
        this.resetTimer();
      }
    }
  }

  private nextSession(state: TimerState): void {
    if (state.currentSession < state.config.sessions) {
      this.timerStateSubject.next({
        ...state,
        isBreak: false,
        currentSession: state.currentSession + 1,
        timeRemaining: state.config.workDuration * 60,
        isRunning: true
      });
    } else {
      this.resetTimer();
    }
  }

  private clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window && Notification.permission === 'default') {
      this.notificationPermission = await Notification.requestPermission();
    } else if ('Notification' in window) {
      this.notificationPermission = Notification.permission;
    }
  }

  private showNotification(title: string, body: string): void {
    if ('Notification' in window && this.notificationPermission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }

  getPresetConfigs(): TimerConfig[] {
    return [
      { workDuration: 25, breakDuration: 5, sessions: 4 },
      { workDuration: 50, breakDuration: 10, sessions: 4 },
      { workDuration: 15, breakDuration: 3, sessions: 4 },
      { workDuration: 90, breakDuration: 20, sessions: 2 }
    ];
  }
}

