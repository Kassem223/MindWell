export type TipCategory = 'all' | 'stress' | 'anxiety' | 'sleep' | 'motivation' | 'productivity';

export interface Tip {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: TipCategory;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

