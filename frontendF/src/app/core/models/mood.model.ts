export type EmotionType = 'happy' | 'sad' | 'anxious' | 'calm' | 'stressed' | 'excited' | 'tired' | 'angry';

export interface Mood {
  id: string;
  userId: string;
  emotion: EmotionType;
  intensity: number; // 1-5
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoodAnalytics {
  totalEntries: number;
  averageIntensity: number;
  mostCommonEmotion: EmotionType;
  moodStreak: number;
  emotionDistribution: {
    emotion: EmotionType;
    count: number;
    percentage: number;
  }[];
  intensityOverTime: {
    date: string;
    intensity: number;
  }[];
}

export interface CreateMoodRequest {
  emotion: EmotionType;
  intensity: number;
  note?: string;
}

