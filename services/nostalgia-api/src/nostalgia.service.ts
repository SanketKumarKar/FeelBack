import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class NostalgiaService {
  private genAI: GoogleGenerativeAI;
  private hf: HfInference;
  private redisClient: RedisClientType;
  private readonly redisEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.redisEnabled = this.configService.get<boolean>('REDIS_ENABLED') || false;
    this.initializeServices();
  }

  private async initializeServices() {
    // Initialize Google Generative AI
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY') || ''
    );

    // Initialize Hugging Face Inference
    this.hf = new HfInference();

    // Initialize Redis
    if (this.redisEnabled) {
      this.redisClient = createClient({
        url: this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379',
      });
      this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
      await this.redisClient.connect();
    }
  }

  async generateNostalgia(
    emotion: string,
    era: string,
    style: string,
  ): Promise<{
    text: string;
    imageUrl: string;
    videoUrl?: string;
  }> {
    const cacheKey = `nostalgia:${emotion}:${era}:${style}`;
    if (this.redisEnabled) {
      const cachedContent = await this.redisClient.get(cacheKey);
      if (cachedContent) {
        console.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedContent);
      }
    }

    // Generate nostalgic text using Gemini
    const text = await this.generateText(emotion, era, style);

    // Generate nostalgic image using Hugging Face
    const imageUrl = await this.generateImage(emotion, era, style);

    const content = { text, imageUrl };

    // Cache the generated content
    if (this.redisEnabled) {
      await this.redisClient.set(cacheKey, JSON.stringify(content), { EX: 3600 }); // Cache for 1 hour
    }

    return content;
  }

  private async generateText(
    emotion: string,
    era: string,
    style: string,
  ): Promise<string> {
    const prompt = `Generate a nostalgic ${emotion} text from the ${era} era in a ${style} style.`;
    
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  private async generateImage(
    emotion: string,
    era: string,
    style: string,
  ): Promise<string> {
    const prompt = `A nostalgic ${emotion} scene from the ${era} era in ${style} style`;
    
    // The Hugging Face inference client's textToImage returns a Blob or Buffer, not a direct string. 
    // I'll use the correct method to get the ArrayBuffer.
    const imageBuffer = await this.hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0', // Using a common Stable Diffusion model
      inputs: prompt,
    });

    // Convert Buffer (or Blob read as ArrayBuffer) to base64 string
    const base64Image = Buffer.from(imageBuffer as any).toString('base64');

    // Return as a data URL directly
    return `data:image/png;base64,${base64Image}`;
  }

  async getNostalgiaHistory(userId: string): Promise<any[]> {
    if (!this.redisEnabled) {
      return [];
    }
    const keys = await this.redisClient.keys(`nostalgia:*`);
    const history = await this.redisClient.mGet(keys);
    return history.map((item: string) => JSON.parse(item));
  }

  async clearNostalgiaHistory(userId: string): Promise<string> {
    if (!this.redisEnabled) {
      return 'Redis is not enabled.';
    }
    const keys = await this.redisClient.keys(`nostalgia:*`);
    if (keys.length > 0) {
      await this.redisClient.del(keys);
      return 'Nostalgia history cleared.';
    } else {
      return 'No nostalgia history to clear.';
    }
  }
} 