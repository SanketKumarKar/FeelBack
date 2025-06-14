import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmotionService } from './emotion.service';

@ApiTags('emotions')
@Controller('emotions')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze emotion from text' })
  @ApiResponse({ status: 201, description: 'Emotion analyzed successfully.', schema: { properties: { emotion: { type: 'string' }, cached: { type: 'boolean' } } } })
  async analyzeEmotion(@Body('text') text: string) {
    const { emotion, cached } = await this.emotionService.analyzeEmotion(text);
    return { emotion, cached };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get emotion analysis history' })
  @ApiResponse({ status: 200, description: 'Emotion history retrieved successfully.', schema: { type: 'array', items: { properties: { emotion: { type: 'string' }, cached: { type: 'boolean' } } } } })
  async getEmotionHistory() {
    return this.emotionService.getEmotionHistory();
  }

  @Post('clear-history')
  @ApiOperation({ summary: 'Clear emotion analysis history' })
  @ApiResponse({ status: 200, description: 'Emotion history cleared successfully.' })
  async clearEmotionHistory() {
    return this.emotionService.clearEmotionHistory();
  }
} 