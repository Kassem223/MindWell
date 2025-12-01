import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note, CreateNoteRequest } from '../models/note.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  constructor(private http: HttpClient) {}

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${API_URL}/notes`);
  }

  createNote(note: CreateNoteRequest): Observable<Note> {
    return this.http.post<Note>(`${API_URL}/notes`, note);
  }

  updateNote(id: string, note: Partial<CreateNoteRequest>): Observable<Note> {
    return this.http.put<Note>(`${API_URL}/notes/${id}`, note);
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/notes/${id}`);
  }
}

