import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import { AdvancedEmotionModel } from './models/advanced-emotion.model';
import { TextPreprocessor } from './utils/text-preprocessor';
import { EmotionAnalysisResult } from './dto/emotion-analysis.dto';
import { EmotionConfig, EmotionHistoryEntry } from './interfaces/emotion.interfaces';
import { EmotionalContentGenerator } from './generators/emotional-content-generator';

@Injectable()
export class EmotionService implements OnModuleDestroy {
  private readonly logger = new Logger(EmotionService.name);
  private redisClient: RedisClientType;
  private readonly config: EmotionConfig;
  private readonly emotionModel: AdvancedEmotionModel;
  private readonly textPreprocessor: TextPreprocessor;
  private readonly contentGenerator: EmotionalContentGenerator;
  private isInitialized = false;

  constructor(
    private configService: ConfigService,
    private readonly emotionalContentGenerator: EmotionalContentGenerator
  ) {
    this.config = {
      redisEnabled: this.configService.get<boolean>('REDIS_ENABLED') || false,
      redisUrl: this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379',
      cacheTimeout: this.configService.get<number>('CACHE_TIMEOUT') || 3600,
      modelType: 'advanced',
      confidenceThreshold: this.configService.get<number>('CONFIDENCE_THRESHOLD') || 0.5,
    };

    this.emotionModel = new AdvancedEmotionModel();
    this.textPreprocessor = new TextPreprocessor();
    this.contentGenerator = emotionalContentGenerator;
    this.initialize();
  }

  async onModuleDestroy() {
    if (this.config.redisEnabled && this.redisClient?.isOpen) {
      await this.redisClient.quit();
      this.logger.log('Redis connection closed');
    }
  }

  private async initialize(): Promise<void> {
    try {
      // Initialize emotion model
      await this.emotionModel.initialize();
      this.logger.log('Emotion model initialized successfully');

      // Initialize Redis if enabled
      if (this.config.redisEnabled) {
        await this.initializeRedis();
      }

      this.isInitialized = true;
      this.logger.log('EmotionService initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize EmotionService', error);
      throw error;
    }
  }

  private async initializeRedis(): Promise<void> {
    try {
      this.redisClient = createClient({
        url: this.config.redisUrl,
        socket: {
          reconnectStrategy: (retries: number) => Math.min(retries * 50, 500),
        },
      });

      this.redisClient.on('error', (err: Error) => {
        this.logger.error('Redis Client Error', err);
      });

      this.redisClient.on('connect', () => {
        this.logger.log('Redis client connected');
      });

      this.redisClient.on('disconnect', () => {
        this.logger.warn('Redis client disconnected');
      });

      await this.redisClient.connect();
      this.logger.log('Redis initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Redis', error);
      // Don't throw error, just disable Redis functionality
      this.config.redisEnabled = false;
    }
  }

  async analyzeEmotion(text: string, userId?: string): Promise<EmotionAnalysisResult> {
    try {
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        throw new Error('Invalid input: text is required and must be a non-empty string');
      }

      if (!this.isInitialized) {
        await this.initialize();
      }

      const processedText = this.textPreprocessor.preprocessText(text);
      
      // Check cache first
      const cacheKey = this.generateCacheKey(processedText, userId);
      if (this.config.redisEnabled) {
        const cachedResult = await this.getCachedResult(cacheKey);
        if (cachedResult) {
          this.logger.debug(`Cache hit for emotion analysis: ${cacheKey}`);
          return { ...cachedResult, cached: true };
        }
      }

      // Perform emotion analysis
      const prediction = await this.emotionModel.predict(text);
      
      const result: EmotionAnalysisResult = {
        emotion: prediction.emotion,
        confidence: prediction.confidence,
        intensity: prediction.intensity,
        allEmotions: prediction.allEmotions,
        timestamp: new Date(),
        cached: false,
        processedText,
      };

      // Cache result
      if (this.config.redisEnabled) {
        await this.cacheResult(cacheKey, result);
      }

      // Store in history
      await this.storeEmotionHistory(text, result, userId);

      this.logger.debug(`Emotion analyzed: ${result.emotion} (${result.confidence})`);
      return result;

    } catch (error) {
      this.logger.error('Error analyzing emotion', error);
      throw new Error(`Emotion analysis failed: ${error.message}`);
    }
  }

  async getEmotionHistory(userId?: string, limit: number = 50): Promise<EmotionHistoryEntry[]> {
    try {
      if (!this.config.redisEnabled) {
        return [];
      }

      const pattern = userId ? `emotion:history:${userId}:*` : 'emotion:history:*:*';
      const keys = await this.redisClient.keys(pattern);
      
      if (keys.length === 0) {
        return [];
      }

      // Sort keys by timestamp (newest first) and limit
      const sortedKeys = keys
        .map(key => ({
          key,
          timestamp: parseInt(key.split(':').pop() || '0'),
        }))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit)
        .map(item => item.key);

      const historyData = await this.redisClient.mGet(sortedKeys);
      
      return historyData
        .filter(data => data !== null)
        .map(data => JSON.parse(data as string))
        .filter(entry => entry !== null);

    } catch (error) {
      this.logger.error('Error retrieving emotion history', error);
      return [];
    }
  }

  async getUserEmotionStats(userId: string, days: number = 7): Promise<{
    totalAnalyses: number;
    emotionDistribution: Record<string, number>;
    averageConfidence: number;
    topEmotions: Array<{ emotion: string; count: number; percentage: number }>;
    intensityDistribution: Record<string, number>;
  }> {
    try {
      const history = await this.getEmotionHistory(userId, days * 10); // Get more entries for better stats
      
      if (history.length === 0) {
        return {
          totalAnalyses: 0,
          emotionDistribution: {},
          averageConfidence: 0,
          topEmotions: [],
          intensityDistribution: {},
        };
      }

      // Filter by date range
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const recentHistory = history.filter(entry => 
        new Date(entry.timestamp) >= cutoffDate
      );

      const totalAnalyses = recentHistory.length;
      const emotionCounts: Record<string, number> = {};
      const intensityCounts: Record<string, number> = {};
      let totalConfidence = 0;

      recentHistory.forEach(entry => {
        emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
        intensityCounts[entry.intensity] = (intensityCounts[entry.intensity] || 0) + 1;
        totalConfidence += entry.confidence;
      });

      const emotionDistribution: Record<string, number> = {};
      Object.keys(emotionCounts).forEach(emotion => {
        emotionDistribution[emotion] = Math.round((emotionCounts[emotion] / totalAnalyses) * 100) / 100;
      });

      const intensityDistribution: Record<string, number> = {};
      Object.keys(intensityCounts).forEach(intensity => {
        intensityDistribution[intensity] = Math.round((intensityCounts[intensity] / totalAnalyses) * 100) / 100;
      });

      const topEmotions = Object.entries(emotionCounts)
        .map(([emotion, count]) => ({
          emotion,
          count,
          percentage: Math.round((count / totalAnalyses) * 100),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalAnalyses,
        emotionDistribution,
        averageConfidence: Math.round((totalConfidence / totalAnalyses) * 100) / 100,
        topEmotions,
        intensityDistribution,
      };

    } catch (error) {
      this.logger.error('Error calculating emotion stats', error);
      throw new Error(`Failed to calculate emotion statistics: ${error.message}`);
    }
  }

  async clearEmotionHistory(userId?: string): Promise<{ message: string; deletedCount: number }> {
    try {
      if (!this.config.redisEnabled) {
        return { message: 'Redis is not enabled', deletedCount: 0 };
      }

      const pattern = userId ? `emotion:history:${userId}:*` : 'emotion:history:*:*';
      const keys = await this.redisClient.keys(pattern);
      
      if (keys.length === 0) {
        return { message: 'No emotion history found', deletedCount: 0 };
      }

      await this.redisClient.del(keys);
      const message = userId 
        ? `Emotion history cleared for user ${userId}`
        : 'All emotion history cleared';
      
      this.logger.log(`${message}. Deleted ${keys.length} entries`);
      return { message, deletedCount: keys.length };

    } catch (error) {
      this.logger.error('Error clearing emotion history', error);
      throw new Error(`Failed to clear emotion history: ${error.message}`);
    }
  }

  /**
   * Generate AI image based on detected emotion
   * @param text The input text for context
   * @param emotion The detected emotion
   * @param prompt Optional custom prompt
   */
  async generateEmotionalImage(text: string, emotion: string, prompt?: string): Promise<string[]> {
    try {
      const basePrompt = prompt || `Visual representation of the emotion ${emotion} from: "${text}"`;
      return await this.contentGenerator.generateEmotionImage(emotion, basePrompt);
    } catch (error) {
      this.logger.error('Error generating emotional image', error);
      throw new Error(`Failed to generate emotional image: ${error.message}`);
    }
  }

  /**
   * Generate AI text response based on user text and detected emotion
   * @param userText The input text from the user
   * @param emotion The detected emotion
   * @param intensity The emotion intensity
   */
  async generateEmotionalResponse(userText: string, emotion: string, intensity: string): Promise<string> {
    try {
      return await this.contentGenerator.generateEmotionalText(userText, emotion, intensity);
    } catch (error) {
      this.logger.error('Error generating emotional text response', error);
      throw new Error(`Failed to generate emotional text response: ${error.message}`);
    }
  }

  /**
   * Generate complete emotional content package including analysis, text and image
   * @param text User input text
   * @param userId Optional user ID
   */
  async generateEmotionalContent(text: string, userId?: string): Promise<{
    analysis: EmotionAnalysisResult;
    textResponse: string;
    images: string[];
  }> {
    try {
      // First analyze the emotion
      const analysis = await this.analyzeEmotion(text, userId);
      
      // Then generate text response based on the emotion
      const textResponse = await this.generateEmotionalResponse(
        text, 
        analysis.emotion, 
        analysis.intensity
      );
      
      // Finally generate image based on the emotion
      const images = await this.generateEmotionalImage(
        text,
        analysis.emotion
      );
      
      return {
        analysis,
        textResponse,
        images
      };
    } catch (error) {
      this.logger.error('Error generating emotional content package', error);
      throw new Error(`Failed to generate emotional content: ${error.message}`);
    }
  }

  private generateCacheKey(text: string, userId?: string): string {
    const textHash = Buffer.from(text).toString('base64').substring(0, 20);
    return userId ? `emotion:cache:${userId}:${textHash}` : `emotion:cache:${textHash}`;
  }

  private async getCachedResult(cacheKey: string): Promise<EmotionAnalysisResult | null> {
    try {
      const cached = await this.redisClient.get(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      this.logger.warn('Error retrieving cached result', error);
      return null;
    }
  }

  private async cacheResult(cacheKey: string, result: EmotionAnalysisResult): Promise<void> {
    try {
      await this.redisClient.set(
        cacheKey, 
        JSON.stringify(result), 
        { EX: this.config.cacheTimeout }
      );
    } catch (error) {
      this.logger.warn('Error caching result', error);
    }
  }

  private async storeEmotionHistory(
    originalText: string, 
    result: EmotionAnalysisResult, 
    userId?: string
  ): Promise<void> {
    try {
      if (!this.config.redisEnabled) return;

      const historyEntry: EmotionHistoryEntry = {
        id: uuidv4(),
        userId,
        text: originalText,
        processedText: result.processedText,
        emotion: result.emotion,
        confidence: result.confidence,
        intensity: result.intensity,
        allEmotions: result.allEmotions,
        timestamp: result.timestamp,
      };

      const historyKey = userId 
        ? `emotion:history:${userId}:${Date.now()}`
        : `emotion:history:anonymous:${Date.now()}`;

      await this.redisClient.set(
        historyKey, 
        JSON.stringify(historyEntry), 
        { EX: this.config.cacheTimeout * 24 } // Store history longer than cache
      );

    } catch (error) {
      this.logger.warn('Error storing emotion history', error);
    }
  }
} 