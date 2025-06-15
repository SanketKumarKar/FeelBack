import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateContentDto {
  @ApiProperty({
    description: 'Text to analyze and generate content for',
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

  @ApiPropertyOptional({
    description: 'Custom prompt for image generation (optional)',
    example: 'A beautiful landscape that captures my current emotion',
  })
  @IsOptional()
  @IsString()
  imagePrompt?: string;
}

export class GenerateImageDto {
  @ApiProperty({
    description: 'Text to use as context for image generation',
    example: 'I am feeling really happy today!',
    minLength: 1,
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(5000)
  text: string;

  @ApiProperty({
    description: 'The emotion to visualize',
    example: 'joy',
  })
  @IsString()
  @IsNotEmpty()
  emotion: string;

  @ApiPropertyOptional({
    description: 'Custom prompt for image generation (optional)',
    example: 'A beautiful landscape that captures happiness',
  })
  @IsOptional()
  @IsString()
  prompt?: string;
}

export class GenerateTextDto {
  @ApiProperty({
    description: 'Input text to respond to',
    example: 'How was your day?',
    minLength: 1,
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(5000)
  text: string;

  @ApiProperty({
    description: 'The emotion to express in the response',
    example: 'joy',
  })
  @IsString()
  @IsNotEmpty()
  emotion: string;

  @ApiProperty({
    description: 'The intensity of the emotion',
    example: 'high',
    enum: ['low', 'medium', 'high'],
  })
  @IsString()
  @IsNotEmpty()
  intensity: string;
}

export class EmotionalContentResult {
  @ApiProperty({
    description: 'Emotion analysis results',
  })
  analysis: any;

  @ApiProperty({
    description: 'Generated text response with emotional tone',
    example: 'I\'m absolutely thrilled to hear from you! Your message brought a smile to my face.',
  })
  textResponse: string;

  @ApiProperty({
    description: 'URLs of generated images that represent the emotion',
    type: [String],
  })
  images: string[];
}
