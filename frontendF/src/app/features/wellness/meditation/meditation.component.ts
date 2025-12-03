import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Track {
  id: number;
  title: string;
  duration: string;
  category: string;
  url: string; // In a real app, this would be a real audio URL
}

@Component({
  selector: 'app-meditation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meditation.component.html',
  styleUrl: './meditation.component.css'
})
export class MeditationComponent {
  tracks: Track[] = [
    { id: 1, title: 'Morning Clarity', duration: '5:00', category: 'Focus', url: '#' },
    { id: 2, title: 'Deep Sleep Release', duration: '10:00', category: 'Sleep', url: '#' },
    { id: 3, title: 'Anxiety SOS', duration: '3:00', category: 'Calm', url: '#' },
    { id: 4, title: 'Walking Meditation', duration: '15:00', category: 'Movement', url: '#' }
  ];

  currentTrack: Track | null = null;
  isPlaying = false;

  playTrack(track: Track) {
    if (this.currentTrack?.id === track.id) {
      this.togglePlay();
    } else {
      this.currentTrack = track;
      this.isPlaying = true;
      // In a real app, we would start the audio element here
    }
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    // Toggle audio element
  }
}
