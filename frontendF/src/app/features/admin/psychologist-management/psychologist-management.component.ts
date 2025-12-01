import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-psychologist-management',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './psychologist-management.component.html',
  styleUrls: ['./psychologist-management.component.scss']
})
export class PsychologistManagementComponent {
  psychologists = [
    { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@example.com', specialization: 'Anxiety, Depression', rating: 4.8, status: 'active' },
    { id: '2', name: 'Dr. Michael Chen', email: 'michael@example.com', specialization: 'Trauma, Stress', rating: 4.9, status: 'active' }
  ];
}
