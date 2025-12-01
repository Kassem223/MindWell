import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', joined: '2024-01-15', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', joined: '2024-02-20', status: 'active' },
    { id: '3', name: 'Admin User', email: 'admin@mindwell.com', role: 'admin', joined: '2024-01-01', status: 'active' }
  ];
}
