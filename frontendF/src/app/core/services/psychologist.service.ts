import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Psychologist, CreatePsychologistRequest } from '../models/psychologist.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class PsychologistService {
  constructor(private http: HttpClient) {}

  getPsychologists(params?: {
    search?: string;
    specialization?: string;
    location?: string;
    language?: string;
    sort?: 'rating' | 'experience' | 'name';
  }): Observable<Psychologist[]> {
    return this.http.get<Psychologist[]>(`${API_URL}/psychologists`, { params });
  }

  getPsychologist(id: string): Observable<Psychologist> {
    return this.http.get<Psychologist>(`${API_URL}/psychologists/${id}`);
  }

  createPsychologist(data: CreatePsychologistRequest): Observable<Psychologist> {
    return this.http.post<Psychologist>(`${API_URL}/psychologists`, data);
  }

  updatePsychologist(id: string, data: Partial<CreatePsychologistRequest>): Observable<Psychologist> {
    return this.http.put<Psychologist>(`${API_URL}/psychologists/${id}`, data);
  }

  deletePsychologist(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/psychologists/${id}`);
  }
}

