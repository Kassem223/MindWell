import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tip, TipCategory } from '../models/tip.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class TipsService {
  constructor(private http: HttpClient) { }

  getTips(category?: TipCategory): Observable<Tip[]> {
    let params = new HttpParams();
    if (category && category !== 'all') {
      params = params.set('category', category);
    }
    return this.http.get<Tip[]>(`${API_URL}/tips`, { params });
  }

  getTip(id: string): Observable<Tip> {
    return this.http.get<Tip>(`${API_URL}/tips/${id}`);
  }
}

