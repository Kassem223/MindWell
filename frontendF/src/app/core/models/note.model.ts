export interface Note {
  id: string;
  userId: string;
  title?: string;
  content: string;
  moodId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title?: string;
  content: string;
  moodId?: string;
}

