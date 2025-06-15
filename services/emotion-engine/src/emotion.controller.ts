import { Controller, Post, Get, Body, Query, Param, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { EmotionService } from './emotion.service';
import { AnalyzeEmotionDto, EmotionAnalysisResult } from './dto/emotion-analysis.dto';
import { 
  GenerateContentDto, 
  GenerateImageDto, 
  GenerateTextDto, 
  EmotionalContentResult 
} from './dto/content-generation.dto';

@ApiTags('emotions')
@Controller('emotions')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Analyze emotion from text',
    description: 'Performs sentiment analysis and emotion detection on provided text with confidence scores and intensity levels'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Emotion analyzed successfully',
    type: EmotionAnalysisResult
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error during emotion analysis'
  })
  async analyzeEmotion(@Body(ValidationPipe) dto: AnalyzeEmotionDto): Promise<EmotionAnalysisResult> {
    return this.emotionService.analyzeEmotion(dto.text, dto.userId);
  }

  @Get('history')
  @ApiOperation({ 
    summary: 'Get emotion analysis history',
    description: 'Retrieves emotion analysis history for a specific user or all analyses'
  })
  @ApiQuery({ 
    name: 'userId', 
    required: false, 
    description: 'User ID to filter history. If not provided, returns all history'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Maximum number of entries to return (default: 50)',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Emotion history retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          text: { type: 'string' },
          emotion: { type: 'string' },
          confidence: { type: 'number' },
          intensity: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  async getEmotionHistory(
    @Query('userId') userId?: string,
    @Query('limit') limit: number = 50
  ) {
    return this.emotionService.getEmotionHistory(userId, limit);
  }

  @Get('stats/:userId')
  @ApiOperation({ 
    summary: 'Get user emotion statistics',
    description: 'Retrieves comprehensive emotion statistics for a specific user'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'User ID to get statistics for'
  })
  @ApiQuery({ 
    name: 'days', 
    required: false, 
    description: 'Number of days to include in statistics (default: 7)',
    type: 'number'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User emotion statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalAnalyses: { type: 'number' },
        emotionDistribution: { type: 'object' },
        averageConfidence: { type: 'number' },
        topEmotions: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              emotion: { type: 'string' },
              count: { type: 'number' },
              percentage: { type: 'number' }
            }
          }
        },
        intensityDistribution: { type: 'object' }
      }
    }
  })
  async getUserEmotionStats(
    @Param('userId') userId: string,
    @Query('days') days: number = 7
  ) {
    return this.emotionService.getUserEmotionStats(userId, days);
  }

  @Post('clear-history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Clear emotion analysis history',
    description: 'Clears emotion analysis history for a specific user or all users'
  })
  @ApiQuery({ 
    name: 'userId', 
    required: false, 
    description: 'User ID to clear history for. If not provided, clears all history'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Emotion history cleared successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        deletedCount: { type: 'number' }
      }
    }
  })
  async clearEmotionHistory(@Query('userId') userId?: string) {
    return this.emotionService.clearEmotionHistory(userId);
  }

  @Post('generate/content')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Generate complete emotional content',
    description: 'Analyzes text, then generates both an emotional text response and image'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Content generated successfully',
    type: EmotionalContentResult
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error during content generation'
  })
  async generateContent(@Body(ValidationPipe) dto: GenerateContentDto): Promise<EmotionalContentResult> {
    return this.emotionService.generateEmotionalContent(dto.text, dto.userId);
  }

  @Post('generate/image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Generate emotion-based image',
    description: 'Generates an image that visually represents a given emotion'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Image generated successfully',
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of image URLs'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error during image generation'
  })
  async generateEmotionalImage(@Body(ValidationPipe) dto: GenerateImageDto): Promise<{ images: string[] }> {
    const images = await this.emotionService.generateEmotionalImage(
      dto.text, 
      dto.emotion, 
      dto.prompt
    );
    return { images };
  }

  @Post('generate/text')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Generate emotional text response',
    description: 'Generates a text response with the specified emotion and intensity'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Text response generated successfully',
    schema: {
      type: 'object',
      properties: {
        response: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error during text generation'
  })
  async generateEmotionalText(@Body(ValidationPipe) dto: GenerateTextDto): Promise<{ response: string }> {
    const response = await this.emotionService.generateEmotionalResponse(
      dto.text, 
      dto.emotion, 
      dto.intensity
    );
    return { response };
  }
} 