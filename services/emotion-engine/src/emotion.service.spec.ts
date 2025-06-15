import { Test, TestingModule } from '@nestjs/testing';
import { EmotionService } from '../src/emotion.service';
import { ConfigService } from '@nestjs/config';
import { AdvancedEmotionModel } from '../src/models/advanced-emotion.model';
import { TextPreprocessor } from '../src/utils/text-preprocessor';

describe('EmotionService', () => {
  let service: EmotionService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmotionService,
        AdvancedEmotionModel,
        TextPreprocessor,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'REDIS_ENABLED':
                  return false; // Disable Redis for testing
                case 'CACHE_TIMEOUT':
                  return 3600;
                case 'CONFIDENCE_THRESHOLD':
                  return 0.5;
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmotionService>(EmotionService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('analyzeEmotion', () => {
    it('should analyze emotion from happy text', async () => {
      const result = await service.analyzeEmotion('I am so happy today!');
      
      expect(result).toBeDefined();
      expect(result.emotion).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.intensity).toMatch(/^(low|medium|high)$/);
      expect(result.allEmotions).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.cached).toBe(false);
      expect(result.processedText).toBeDefined();
    });

    it('should analyze emotion from sad text', async () => {
      const result = await service.analyzeEmotion('I feel so devastated and heartbroken');
      
      expect(result.emotion).toBe('sadness');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should handle empty text', async () => {
      await expect(service.analyzeEmotion('')).rejects.toThrow('Invalid input');
    });

    it('should handle text with userId', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const result = await service.analyzeEmotion('I love this!', userId);
      
      expect(result).toBeDefined();
      expect(result.emotion).toBeDefined();
    });
  });

  describe('getUserEmotionStats', () => {
    it('should return empty stats for user with no history', async () => {
      const stats = await service.getUserEmotionStats('test-user-id');
      
      expect(stats.totalAnalyses).toBe(0);
      expect(stats.emotionDistribution).toEqual({});
      expect(stats.averageConfidence).toBe(0);
      expect(stats.topEmotions).toEqual([]);
      expect(stats.intensityDistribution).toEqual({});
    });
  });

  describe('clearEmotionHistory', () => {
    it('should handle clearing history when Redis is disabled', async () => {
      const result = await service.clearEmotionHistory();
      
      expect(result.message).toContain('Redis is not enabled');
      expect(result.deletedCount).toBe(0);
    });
  });
});

describe('TextPreprocessor', () => {
  let preprocessor: TextPreprocessor;

  beforeEach(() => {
    preprocessor = new TextPreprocessor();
  });

  describe('preprocessText', () => {
    it('should clean and normalize text', () => {
      const input = "I'm REALLY excited!!! This is AMAZING!!!";
      const result = preprocessor.preprocessText(input);
      
      expect(result).toBe("i am really excited! this is amazing!");
    });

    it('should expand contractions', () => {
      const input = "I can't believe it's that amazing!";
      const result = preprocessor.preprocessText(input);
      
      expect(result).toBe("i cannot believe it is that amazing!");
    });

    it('should remove URLs and emails', () => {
      const input = "Check this out https://example.com and email me at test@example.com";
      const result = preprocessor.preprocessText(input);
      
      expect(result).not.toContain('https://example.com');
      expect(result).not.toContain('test@example.com');
    });
  });

  describe('extractFeatures', () => {
    it('should extract emotional features', () => {
      const features = preprocessor.extractFeatures("I'm REALLY excited!!! This is amazing!");
      
      expect(features.hasExclamation).toBe(true);
      expect(features.hasCapitals).toBe(true);
      expect(features.hasIntensifiers).toBe(true);
      expect(features.hasEmotionalWords).toBe(true);
      expect(features.wordCount).toBeGreaterThan(0);
    });
  });
});

describe('AdvancedEmotionModel', () => {
  let model: AdvancedEmotionModel;

  beforeEach(async () => {
    model = new AdvancedEmotionModel();
    await model.initialize();
  });

  describe('predict', () => {
    it('should predict joy for happy text', async () => {
      const result = await model.predict('I am absolutely thrilled and overjoyed!');
      
      expect(result.emotion).toBe('joy');
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.intensity).toMatch(/^(low|medium|high)$/);
      expect(result.allEmotions).toBeDefined();
    });

    it('should predict sadness for sad text', async () => {
      const result = await model.predict('I am so devastated and heartbroken');
      
      expect(result.emotion).toBe('sadness');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should predict anger for angry text', async () => {
      const result = await model.predict('I am absolutely furious and livid!');
      
      expect(result.emotion).toBe('anger');
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should provide confidence scores for all emotions', async () => {
      const result = await model.predict('I feel happy');
      
      expect(Object.keys(result.allEmotions).length).toBeGreaterThan(1);
      expect(Object.values(result.allEmotions).every(score => score >= 0 && score <= 1)).toBe(true);
    });
  });
});
