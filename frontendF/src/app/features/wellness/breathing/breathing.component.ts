import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breathing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breathing.component.html',
  styleUrl: './breathing.component.css'
})
export class BreathingComponent implements OnDestroy {
  isActive = false;
  phase: 'inhale' | 'hold' | 'exhale' | 'ready' = 'ready';
  instruction = 'Ready to relax?';
  timer: any;

  // 4-7-8 Breathing Technique
  // Inhale: 4s
  // Hold: 7s
  // Exhale: 8s

  toggleExercise() {
    if (this.isActive) {
      this.stopExercise();
    } else {
      this.startExercise();
    }
  }

  startExercise() {
    this.isActive = true;
    this.runCycle();
  }

  stopExercise() {
    this.isActive = false;
    this.phase = 'ready';
    this.instruction = 'Ready to relax?';
    clearTimeout(this.timer);
  }

  runCycle() {
    if (!this.isActive) return;

    // Inhale (4s)
    this.phase = 'inhale';
    this.instruction = 'Breathe In...';

    this.timer = setTimeout(() => {
      if (!this.isActive) return;

      // Hold (7s)
      this.phase = 'hold';
      this.instruction = 'Hold...';

      this.timer = setTimeout(() => {
        if (!this.isActive) return;

        // Exhale (8s)
        this.phase = 'exhale';
        this.instruction = 'Breathe Out...';

        this.timer = setTimeout(() => {
          if (!this.isActive) return;
          this.runCycle(); // Repeat
        }, 8000);

      }, 7000);

    }, 4000);
  }

  ngOnDestroy() {
    this.stopExercise();
  }
}
