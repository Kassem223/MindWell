import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { BreathingComponent } from './breathing/breathing.component';
import { MeditationComponent } from './meditation/meditation.component';

@Component({
  selector: 'app-wellness',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, BreathingComponent, MeditationComponent],
  templateUrl: './wellness.component.html',
  styleUrl: './wellness.component.css'
})
export class WellnessComponent {
  activeTab: 'breathing' | 'meditation' = 'breathing';

  setActiveTab(tab: 'breathing' | 'meditation') {
    this.activeTab = tab;
  }
}
