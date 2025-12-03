import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mood, MoodAnalytics, CreateMoodRequest } from '../models/mood.model';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  constructor(private http: HttpClient) {}

  getMoods(): Observable<Mood[]> {
    return this.http.get<Mood[]>(`${API_URL}/mood`);
  }

  createMood(mood: CreateMoodRequest): Observable<Mood> {
    return this.http.post<Mood>(`${API_URL}/mood`, mood);
  }

  updateMood(id: string, mood: Partial<CreateMoodRequest>): Observable<Mood> {
    return this.http.put<Mood>(`${API_URL}/mood/${id}`, mood);
  }

  deleteMood(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/mood/${id}`);
  }

  getAnalytics(range?: '7d' | '30d' | '90d'): Observable<MoodAnalytics> {
    let params = new HttpParams();
    if (range) {
      params = params.set('range', range);
    }
    return this.http.get<MoodAnalytics>(`${API_URL}/mood/analytics`, { params });
  }
}

