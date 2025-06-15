import { NovitaSDK, TaskStatus } from "novita-sdk";
import OpenAI from "openai";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service for generating emotional content using LLM and image generation
 */
@Injectable()
export class EmotionalContentGenerator {
  private novitaClient: NovitaSDK;
  private openaiClient: OpenAI;
  
  constructor(private configService: ConfigService) {
    // Get API keys from environment variables
    const novitaApiKey = this.configService.get<string>('NOVITA_API_KEY');
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    const openaiBaseUrl = this.configService.get<string>('OPENAI_BASE_URL') || 'https://api.novita.ai/v3/openai';
    
    if (!novitaApiKey) {
      console.warn('NOVITA_API_KEY not found in environment variables. Image generation will not work.');
    }
    
    if (!openaiApiKey) {
      console.warn('OPENAI_API_KEY not found in environment variables. Text generation will not work.');
    }
    
    // Initialize the Novita SDK client
    this.novitaClient = new NovitaSDK(novitaApiKey || 'dummy_key');
    
    // Initialize OpenAI-compatible client
    this.openaiClient = new OpenAI({
      baseURL: openaiBaseUrl,
      apiKey: openaiApiKey || 'dummy_key',
    });
  }
  
  /**
   * Generate image based on emotion and text prompt
   */
  async generateEmotionImage(emotion: string, prompt: string, width = 512, height = 512): Promise<string[]> {
    return new Promise((resolve, reject) => {
      // Build prompt based on emotion
      const enhancedPrompt = this.buildImagePrompt(emotion, prompt);
      
      // Set parameters for image generation
      const params = {
        request: {
          model_name: "AnythingV5_v5PrtRE.safetensors",
          prompt: enhancedPrompt,
          negative_prompt: "blurry, low quality, distorted, deformed, disfigured",
          width,
          height,
          sampler_name: "DPM++ 2S a Karras",
          guidance_scale: 7.5,
          steps: 20,
          image_num: 4,
          clip_skip: 1,
          seed: -1,
          loras: [],
        },
      };
      
      // Call the Novita SDK
      this.novitaClient.txt2ImgV3(params)
        .then((res) => {
          if (res && res.task_id) {
            const timer = setInterval(() => {
              this.novitaClient.progress({
                task_id: res.task_id,
              })
                .then((progressRes) => {
                  if (progressRes.task.status === TaskStatus.SUCCEED) {
                    clearInterval(timer);
                    resolve(progressRes.images);
                  }
                  if (progressRes.task.status === TaskStatus.FAILED) {
                    clearInterval(timer);
                    reject(new Error(`Image generation failed: ${progressRes.task.reason}`));
                  }
                })
                .catch((err) => {
                  clearInterval(timer);
                  reject(err);
                });
            }, 1000);
          } else {
            reject(new Error('No task ID returned'));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  
  /**
   * Generate emotional text response using LLM
   */
  async generateEmotionalText(userText: string, emotion: string, intensity: string): Promise<string> {
    const prompt = this.buildTextPrompt(userText, emotion, intensity);
    
    try {
      const completion = await this.openaiClient.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an emotional assistant that responds with text conveying the emotion: ${emotion} at ${intensity} intensity. Be authentic but not over-dramatic.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "deepseek/deepseek-r1-0528-qwen3-8b",
        stream: false,
        response_format: { type: "text" }
      });
      
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating emotional text:', error);
      throw error;
    }
  }
  
  /**
   * Build a prompt for image generation based on emotion
   */
  private buildImagePrompt(emotion: string, basePrompt: string): string {
    const emotionPrompts = {
      'joy': 'bright, colorful, sunny, vibrant, uplifting scenery',
      'sadness': 'muted colors, rain, melancholic scenery, soft shadows',
      'anger': 'intense red tones, dark shadows, dynamic composition',
      'fear': 'dark atmosphere, shadows, mist, unsettling composition',
      'surprise': 'vivid colors, unexpected elements, high contrast',
      'love': 'soft pink and red tones, gentle lighting, intimate composition',
      'neutral': 'balanced colors, even lighting, calm composition',
      'excitement': 'vibrant colors, dynamic composition, energy',
      'contentment': 'warm colors, peaceful scenery, soft lighting',
      'anxiety': 'unstable composition, tense atmosphere, sharp edges',
      'frustration': 'disorganized composition, restricted space, barriers'
    };
    
    const emotionPrompt = emotionPrompts[emotion] || emotionPrompts['neutral'];
    return `${basePrompt}, ${emotionPrompt}, emotional, expressive, 4k, highly detailed`;
  }
  
  /**
   * Build a prompt for text generation based on emotion and intensity
   */
  private buildTextPrompt(userText: string, emotion: string, intensity: string): string {
    return `Respond to this message: "${userText}" with text that conveys the emotion of ${emotion} at ${intensity} intensity. Make your response thoughtful and contextually relevant without explicitly stating the emotion.`;
  }
}
