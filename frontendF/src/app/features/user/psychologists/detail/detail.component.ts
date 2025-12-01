import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PsychologistService } from '../../../../core/services/psychologist.service';
import { Psychologist } from '../../../../core/models/psychologist.model';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-psychologist-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class PsychologistDetailComponent implements OnInit {
  psychologist: Psychologist | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private psychologistService: PsychologistService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPsychologist(id);
    }
  }

  loadPsychologist(id: string): void {
    this.loading = true;
    this.psychologistService.getPsychologist(id).subscribe({
      next: (psychologist) => {
        this.psychologist = psychologist;
        this.loading = false;
      },
      error: () => {
        // Mock data for testing
        this.psychologist = this.getMockPsychologist(id);
        this.loading = false;
      }
    });
  }

  sendEmail(): void {
    if (this.psychologist) {
      window.location.href = `mailto:${this.psychologist.email}`;
    }
  }

  callNow(): void {
    if (this.psychologist) {
      window.location.href = `tel:${this.psychologist.phone}`;
    }
  }

  goBack(): void {
    this.router.navigate(['/psychologists']);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getMockPsychologist(id: string): Psychologist {
    return {
      id,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      specialization: ['Anxiety', 'Depression'],
      bio: 'Licensed clinical psychologist with 10 years of experience helping individuals overcome anxiety and depression. I use evidence-based treatments including CBT and mindfulness-based approaches.',
      location: 'New York',
      experience: 10,
      languages: ['English', 'Spanish'],
      rating: 4.8,
      reviewsCount: 127,
      availability: 'available',
      education: ['Ph.D. in Clinical Psychology, Columbia University', 'M.A. in Psychology, NYU'],
      certifications: ['Licensed Clinical Psychologist (NY)', 'Certified CBT Therapist'],
      approach: 'I use a combination of Cognitive Behavioral Therapy (CBT), mindfulness techniques, and person-centered approaches to help clients achieve their mental health goals.',
      sessionFees: 150,
      createdAt: new Date().toISOString()
    };
  }
}
