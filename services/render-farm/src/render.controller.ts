import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RenderService } from './render.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('render')
@Controller('render')
@UseGuards(AuthGuard('jwt'))
export class RenderController {
  constructor(private readonly renderService: RenderService) {}

  @Post('video')
  @ApiOperation({ summary: 'Generate a video from content' })
  @ApiResponse({
    status: 200,
    description: 'Returns the generated video URL and thumbnail',
  })
  async generateVideo(
    @Body('content') content: {
      text: string;
      imageUrl: string;
      musicUrl?: string;
    },
    @Body('options') options: {
      duration: number;
      format: 'tiktok' | 'instagram' | 'story';
      style: string;
    },
  ): Promise<{
    videoUrl: string;
    thumbnailUrl: string;
  }> {
    return this.renderService.generateVideo(content, options);
  }

  @Post('story')
  @ApiOperation({ summary: 'Generate a story from content' })
  @ApiResponse({
    status: 200,
    description: 'Returns the generated story URL',
  })
  async generateStory(
    @Body('content') content: {
      text: string;
      imageUrl: string;
    },
    @Body('options') options: {
      format: 'instagram' | 'snapchat';
      style: string;
    },
  ): Promise<{
    storyUrl: string;
  }> {
    return this.renderService.generateStory(content, options);
  }

  @Get('status/:jobId')
  @ApiOperation({ summary: 'Get render job status' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current status of the render job',
  })
  async getRenderStatus(
    @Param('jobId') jobId: string,
  ): Promise<{
    status: 'completed' | 'failed' | 'processing';
    progress: number;
    result?: any;
    error?: string;
  }> {
    return this.renderService.getRenderStatus(jobId);
  }
} 