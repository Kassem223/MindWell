import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PsychologistService } from '../../../core/services/psychologist.service';
import { Psychologist } from '../../../core/models/psychologist.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-psychologists',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './psychologists.component.html',
  styleUrls: ['./psychologists.component.scss']
})
export class PsychologistsComponent implements OnInit {
  psychologists: Psychologist[] = [];
  filteredPsychologists: Psychologist[] = [];
  searchQuery = '';
  selectedSpecialization = '';
  selectedLocation = '';
  sortBy = 'rating';
  loading = false;

  specializations = ['Anxiety', 'Depression', 'Trauma', 'Relationships', 'Addiction', 'Stress'];
  locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];

  constructor(
    private psychologistService: PsychologistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPsychologists();
  }

  loadPsychologists(): void {
    this.loading = true;
    this.psychologistService.getPsychologists({
      search: this.searchQuery,
      specialization: this.selectedSpecialization,
      location: this.selectedLocation,
      sort: this.sortBy as any
    }).subscribe({
      next: (psychologists) => {
        this.psychologists = psychologists;
        this.filteredPsychologists = psychologists;
        this.loading = false;
      },
      error: () => {
        // Mock data for testing
        this.psychologists = this.getMockPsychologists();
        this.filteredPsychologists = this.psychologists;
        this.loading = false;
      }
    });
  }

  search(): void {
    this.loadPsychologists();
  }

  filter(): void {
    this.loadPsychologists();
  }

  sort(): void {
    this.loadPsychologists();
  }

  viewProfile(id: string): void {
    this.router.navigate(['/psychologists', id]);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getMockPsychologists(): Psychologist[] {
    return [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1 (555) 123-4567',
        specialization: ['Anxiety', 'Depression'],
        bio: 'Licensed clinical psychologist with 10 years of experience helping individuals overcome anxiety and depression.',
        location: 'New York',
        experience: 10,
        languages: ['English', 'Spanish'],
        rating: 4.8,
        reviewsCount: 127,
        availability: 'available',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1 (555) 234-5678',
        specialization: ['Trauma', 'Stress'],
        bio: 'Specialized in trauma therapy and stress management with a focus on evidence-based treatments.',
        location: 'Los Angeles',
        experience: 8,
        languages: ['English', 'Mandarin'],
        rating: 4.9,
        reviewsCount: 89,
        availability: 'available',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        phone: '+1 (555) 345-6789',
        specialization: ['Relationships', 'Anxiety'],
        bio: 'Couples and individual therapist helping people build healthier relationships and manage anxiety.',
        location: 'Chicago',
        experience: 6,
        languages: ['English', 'Spanish', 'French'],
        rating: 4.7,
        reviewsCount: 156,
        availability: 'busy',
        createdAt: new Date().toISOString()
      }
    ];
  }
}
