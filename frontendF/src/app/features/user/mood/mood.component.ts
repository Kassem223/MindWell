import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoodService } from '../../../core/services/mood.service';
import { NoteService } from '../../../core/services/note.service';
import { Mood, EmotionType, CreateMoodRequest } from '../../../core/models/mood.model';
import { Note, CreateNoteRequest } from '../../../core/models/note.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-mood',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, DatePipe],
  templateUrl: './mood.component.html',
  styleUrls: ['./mood.component.scss']
})
export class MoodComponent implements OnInit {
  activeTab = 'mood';
  
  // Mood Tracker
  selectedEmotion: EmotionType | null = null;
  intensity = 3;
  moodNote = '';
  moods: Mood[] = [];
  loading = false;

  emotions: { type: EmotionType; emoji: string; label: string; color: string }[] = [
    { type: 'happy', emoji: '😊', label: 'Happy', color: '#FFD93D' },
    { type: 'sad', emoji: '😢', label: 'Sad', color: '#6BCAE2' },
    { type: 'anxious', emoji: '😰', label: 'Anxious', color: '#FF9F66' },
    { type: 'calm', emoji: '😌', label: 'Calm', color: '#88D8B0' },
    { type: 'stressed', emoji: '😤', label: 'Stressed', color: '#FF6B6B' },
    { type: 'excited', emoji: '🤩', label: 'Excited', color: '#FFB6C1' },
    { type: 'tired', emoji: '😴', label: 'Tired', color: '#B0B0B0' },
    { type: 'angry', emoji: '😠', label: 'Angry', color: '#C94A4A' }
  ];

  // Notes
  notes: Note[] = [];
  showNoteEditor = false;
  editingNote: Note | null = null;
  noteTitle = '';
  noteContent = '';

  constructor(
    private moodService: MoodService,
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    this.loadMoods();
    this.loadNotes();
  }

  loadMoods(): void {
    this.loading = true;
    this.moodService.getMoods().subscribe({
      next: (moods) => {
        this.moods = moods;
        this.loading = false;
      },
      error: () => {
        // Mock data
        this.moods = this.getMockMoods();
        this.loading = false;
      }
    });
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
      },
      error: () => {
        // Mock data
        this.notes = this.getMockNotes();
      }
    });
  }

  selectEmotion(emotion: EmotionType): void {
    this.selectedEmotion = emotion;
  }

  saveMood(): void {
    if (!this.selectedEmotion) return;

    const moodData: CreateMoodRequest = {
      emotion: this.selectedEmotion,
      intensity: this.intensity,
      note: this.moodNote || undefined
    };

    this.loading = true;
    this.moodService.createMood(moodData).subscribe({
      next: (mood) => {
        this.moods.unshift(mood);
        this.selectedEmotion = null;
        this.intensity = 3;
        this.moodNote = '';
        this.loading = false;
      },
      error: () => {
        // Mock save
        const newMood: Mood = {
          id: Date.now().toString(),
          userId: '1',
          emotion: moodData.emotion,
          intensity: moodData.intensity,
          note: moodData.note,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.moods.unshift(newMood);
        this.selectedEmotion = null;
        this.intensity = 3;
        this.moodNote = '';
        this.loading = false;
      }
    });
  }

  deleteMood(id: string): void {
    if (confirm('Are you sure you want to delete this mood entry?')) {
      this.moodService.deleteMood(id).subscribe({
        next: () => {
          this.moods = this.moods.filter(m => m.id !== id);
        },
        error: () => {
          this.moods = this.moods.filter(m => m.id !== id);
        }
      });
    }
  }

  openNoteEditor(note?: Note): void {
    if (note) {
      this.editingNote = note;
      this.noteTitle = note.title || '';
      this.noteContent = note.content;
    } else {
      this.editingNote = null;
      this.noteTitle = '';
      this.noteContent = '';
    }
    this.showNoteEditor = true;
  }

  closeNoteEditor(): void {
    this.showNoteEditor = false;
    this.editingNote = null;
    this.noteTitle = '';
    this.noteContent = '';
  }

  saveNote(): void {
    if (!this.noteContent.trim()) return;

    const noteData: CreateNoteRequest = {
      title: this.noteTitle || undefined,
      content: this.noteContent
    };

    if (this.editingNote) {
      this.noteService.updateNote(this.editingNote.id, noteData).subscribe({
        next: (note) => {
          const index = this.notes.findIndex(n => n.id === note.id);
          if (index >= 0) {
            this.notes[index] = note;
          }
          this.closeNoteEditor();
        },
        error: () => {
          const index = this.notes.findIndex(n => n.id === this.editingNote!.id);
          if (index >= 0) {
            this.notes[index] = { ...this.notes[index], ...noteData };
          }
          this.closeNoteEditor();
        }
      });
    } else {
      this.noteService.createNote(noteData).subscribe({
        next: (note) => {
          this.notes.unshift(note);
          this.closeNoteEditor();
        },
        error: () => {
          const newNote: Note = {
            id: Date.now().toString(),
            userId: '1',
            title: noteData.title,
            content: noteData.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          this.notes.unshift(newNote);
          this.closeNoteEditor();
        }
      });
    }
  }

  deleteNote(id: string): void {
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(id).subscribe({
        next: () => {
          this.notes = this.notes.filter(n => n.id !== id);
        },
        error: () => {
          this.notes = this.notes.filter(n => n.id !== id);
        }
      });
    }
  }

  getEmotionData(emotion: EmotionType) {
    return this.emotions.find(e => e.type === emotion);
  }

  getMockMoods(): Mood[] {
    return [
      {
        id: '1',
        userId: '1',
        emotion: 'happy',
        intensity: 4,
        note: 'Had a great day at work!',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        userId: '1',
        emotion: 'calm',
        intensity: 3,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  }

  getMockNotes(): Note[] {
    return [
      {
        id: '1',
        userId: '1',
        title: 'Gratitude Journal',
        content: 'Today I am grateful for my health, my family, and the beautiful weather.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }
}
