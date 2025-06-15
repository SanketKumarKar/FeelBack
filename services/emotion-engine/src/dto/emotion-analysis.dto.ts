import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyzeEmotionDto {
  @ApiProperty({
    description: 'Text to analyze for emotions',
    example: 'I am feeling really happy today!',
    minLength: 1,
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(5000)
  text: string;

  @ApiPropertyOptional({
    description: 'User ID for personalized emotion tracking',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class EmotionAnalysisResult {
  @ApiProperty({
    description: 'Primary detected emotion',
    example: 'joy',
  })
  emotion: string;

  @ApiProperty({
    description: 'Confidence score between 0 and 1',
    example: 0.85,
  })
  confidence: number;

  @ApiProperty({
    description: 'Emotion intensity (low, medium, high)',
    example: 'high',
  })
  intensity: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'All detected emotions with scores',
    example: {
      joy: 0.85,
      excitement: 0.65,
      contentment: 0.45,
    },
  })
  allEmotions: Record<string, number>;

  @ApiProperty({
    description: 'Analysis timestamp',
    example: '2025-06-15T10:30:00.000Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'Whether result was retrieved from cache',
    example: false,
  })
  cached: boolean;

  @ApiProperty({
    description: 'Processed text after cleaning',
    example: 'feeling really happy today',
  })
  processedText: string;
}
