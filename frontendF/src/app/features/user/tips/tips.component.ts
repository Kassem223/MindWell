import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipsService } from '../../../core/services/tips.service';
import { Tip, TipCategory } from '../../../core/models/tip.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-tips',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss']
})
export class TipsComponent implements OnInit {
  tips: Tip[] = [];
  filteredTips: Tip[] = [];
  selectedCategory: TipCategory = 'all';
  searchQuery = '';
  selectedTip: Tip | null = null;
  loading = false;

  categories: { value: TipCategory; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'stress', label: 'Stress' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'motivation', label: 'Motivation' },
    { value: 'productivity', label: 'Productivity' }
  ];

  constructor(private tipsService: TipsService) {}

  ngOnInit(): void {
    this.loadTips();
  }

  loadTips(): void {
    this.loading = true;
    this.tipsService.getTips(this.selectedCategory).subscribe({
      next: (tips) => {
        this.tips = tips;
        this.filteredTips = tips;
        this.loading = false;
      },
      error: () => {
        // Mock data for testing
        this.tips = this.getMockTips();
        this.filteredTips = this.tips;
        this.loading = false;
      }
    });
  }

  filterByCategory(category: TipCategory): void {
    this.selectedCategory = category;
    this.loadTips();
  }

  searchTips(): void {
    if (!this.searchQuery.trim()) {
      this.filteredTips = this.tips;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredTips = this.tips.filter(tip =>
      tip.title.toLowerCase().includes(query) ||
      tip.excerpt.toLowerCase().includes(query) ||
      tip.content.toLowerCase().includes(query)
    );
  }

  viewTip(tip: Tip): void {
    this.selectedTip = tip;
  }

  closeTipDetail(): void {
    this.selectedTip = null;
  }

  getMockTips(): Tip[] {
    return [
      {
        id: '1',
        title: 'Deep Breathing Techniques for Instant Calm',
        excerpt: 'Learn simple breathing exercises to reduce stress and anxiety in minutes.',
        content: 'Deep breathing is one of the most effective ways to calm your nervous system. Try the 4-7-8 technique: inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.',
        category: 'anxiety',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'How to Build a Morning Routine for Mental Wellness',
        excerpt: 'Start your day right with a structured morning routine that sets a positive tone.',
        content: 'A consistent morning routine can significantly improve your mental health. Start with 10 minutes of meditation, followed by light exercise, a healthy breakfast, and setting daily intentions.',
        category: 'motivation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Managing Work Stress: A Practical Guide',
        excerpt: 'Practical strategies to handle workplace stress and maintain work-life balance.',
        content: 'Work stress is common but manageable. Set clear boundaries, take regular breaks, prioritize tasks, and practice time management. Remember to disconnect after work hours.',
        category: 'stress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Sleep Hygiene: 7 Steps to Better Rest',
        excerpt: 'Improve your sleep quality with these evidence-based sleep hygiene practices.',
        content: 'Good sleep is essential for mental health. Maintain a consistent sleep schedule, create a relaxing bedtime routine, avoid screens before bed, keep your bedroom cool and dark, limit caffeine, exercise regularly, and manage stress.',
        category: 'sleep',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        title: 'Mindfulness Exercises for Beginners',
        excerpt: 'Simple mindfulness practices you can start today to improve your mental wellbeing.',
        content: 'Mindfulness helps you stay present and reduce anxiety. Start with 5-minute daily sessions. Focus on your breath, observe your thoughts without judgment, and practice body scanning.',
        category: 'anxiety',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '6',
        title: 'The Power of Gratitude Journaling',
        excerpt: 'Discover how writing down what you\'re grateful for can transform your mindset.',
        content: 'Gratitude journaling rewires your brain to focus on positive aspects of life. Write down 3 things you\'re grateful for each day. Be specific and reflect on why they matter to you.',
        category: 'motivation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
}
