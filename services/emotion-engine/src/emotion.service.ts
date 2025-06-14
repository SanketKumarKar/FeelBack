import { Injectable } from '@nestjs/common';
import * as natural from 'natural';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class EmotionService {
  private classifier: any;
  private redisClient: RedisClientType;
  private readonly redisEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.redisEnabled = this.configService.get<boolean>('REDIS_ENABLED') || false;
    this.initializeClassifier();
    if (this.redisEnabled) {
      this.initializeRedis();
    }
  }

  private async initializeClassifier() {
    // This is a placeholder for a more sophisticated model loading
    this.classifier = new natural.BayesClassifier();
    // Dummy training data
    this.classifier.addDocument('happy great wonderful', 'positive');
    this.classifier.addDocument('sad bad terrible', 'negative');
    this.classifier.addDocument('neutral okay fine', 'neutral');
    this.classifier.train();
  }

  private async initializeRedis() {
    this.redisClient = createClient({
      url: this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379',
    });
    this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await this.redisClient.connect();
  }

  async analyzeEmotion(text: string): Promise<{ emotion: string; cached: boolean }> {
    const cacheKey = `emotion:${text}`;
    if (this.redisEnabled) {
      const cachedEmotion = await this.redisClient.get(cacheKey);
      if (cachedEmotion) {
        console.log(`Cache hit for ${text}: ${cachedEmotion}`);
        return { emotion: cachedEmotion, cached: true };
      }
    }

    const emotion = this.classifier.classify(text);
    if (this.redisEnabled) {
      await this.redisClient.set(cacheKey, emotion, { EX: 3600 }); // Cache for 1 hour
    }
    return { emotion, cached: false };
  }

  async getEmotionHistory(): Promise<any[]> {
    if (!this.redisEnabled) {
      return [];
    }
    const keys = await this.redisClient.keys('emotion:*');
    const history = await this.redisClient.mGet(keys);
    return history.map((item: string) => JSON.parse(item));
  }

  async clearEmotionHistory(): Promise<string> {
    if (!this.redisEnabled) {
      return 'Redis is not enabled.';
    }
    const keys = await this.redisClient.keys('emotion:*');
    if (keys.length > 0) {
      await this.redisClient.del(keys);
      return 'Emotion history cleared.';
    } else {
      return 'No emotion history to clear.';
    }
  }
} 