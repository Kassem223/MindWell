export interface Psychologist {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  specialization: string[];
  bio: string;
  location: string;
  experience: number; // years
  languages: string[];
  rating: number;
  reviewsCount: number;
  availability: 'available' | 'busy';
  education?: string[];
  certifications?: string[];
  approach?: string;
  sessionFees?: number;
  createdAt: string;
}

export interface CreatePsychologistRequest {
  name: string;
  email: string;
  phone: string;
  photo?: string;
  specialization: string[];
  bio: string;
  location: string;
  experience: number;
  languages: string[];
  education?: string[];
  certifications?: string[];
  approach?: string;
  sessionFees?: number;
}

