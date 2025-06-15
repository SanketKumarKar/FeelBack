export interface EmotionModel {
  predict(text: string): Promise<EmotionPrediction>;
  initialize(): Promise<void>;
}

export interface EmotionPrediction {
  emotion: string;
  confidence: number;
  allEmotions: Record<string, number>;
  intensity: 'low' | 'medium' | 'high';
}

export interface EmotionHistoryEntry {
  id: string;
  userId?: string;
  text: string;
  processedText: string;
  emotion: string;
  confidence: number;
  intensity: string;
  allEmotions: Record<string, number>;
  timestamp: Date;
}

export interface EmotionConfig {
  redisEnabled: boolean;
  redisUrl: string;
  cacheTimeout: number;
  modelType: 'basic' | 'advanced' | 'tensorflow';
  confidenceThreshold: number;
}

export const EMOTION_CATEGORIES = {
  // Primary emotions
  JOY: 'joy',
  SADNESS: 'sadness',
  ANGER: 'anger',
  FEAR: 'fear',
  SURPRISE: 'surprise',
  DISGUST: 'disgust',
  
  // Secondary emotions
  EXCITEMENT: 'excitement',
  CONTENTMENT: 'contentment',
  LOVE: 'love',
  HOPE: 'hope',
  PRIDE: 'pride',
  GRATITUDE: 'gratitude',
  
  // Negative emotions
  ANXIETY: 'anxiety',
  FRUSTRATION: 'frustration',
  DISAPPOINTMENT: 'disappointment',
  LONELINESS: 'loneliness',
  GUILT: 'guilt',
  SHAME: 'shame',
  
  // Neutral states
  NEUTRAL: 'neutral',
  CONFUSION: 'confusion',
  CURIOSITY: 'curiosity',
} as const;

export type EmotionCategory = typeof EMOTION_CATEGORIES[keyof typeof EMOTION_CATEGORIES];
