import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as ffmpeg from 'fluent-ffmpeg';
import { S3 } from 'aws-sdk';
import { Redis } from 'redis';

@Injectable()
export class RenderService {
  private s3: S3;
  private redis: Redis;

  constructor(
    @InjectQueue('render') private renderQueue: Queue,
  ) {
    this.initializeServices();
  }

  private async initializeServices() {
    // Initialize AWS S3
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    // Initialize Redis
    this.redis = new Redis({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
  }

  async generateVideo(
    content: {
      text: string;
      imageUrl: string;
      musicUrl?: string;
    },
    options: {
      duration: number;
      format: 'tiktok' | 'instagram' | 'story';
      style: string;
    },
  ): Promise<{
    videoUrl: string;
    thumbnailUrl: string;
  }> {
    // Add render job to queue
    const job = await this.renderQueue.add(
      'generate-video',
      {
        content,
        options,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );

    // Wait for job completion
    const result = await job.finished();

    return {
      videoUrl: result.videoUrl,
      thumbnailUrl: result.thumbnailUrl,
    };
  }

  async generateStory(
    content: {
      text: string;
      imageUrl: string;
    },
    options: {
      format: 'instagram' | 'snapchat';
      style: string;
    },
  ): Promise<{
    storyUrl: string;
  }> {
    // Add render job to queue
    const job = await this.renderQueue.add(
      'generate-story',
      {
        content,
        options,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );

    // Wait for job completion
    const result = await job.finished();

    return {
      storyUrl: result.storyUrl,
    };
  }

  async getRenderStatus(jobId: string): Promise<{
    status: 'completed' | 'failed' | 'processing';
    progress: number;
    result?: any;
    error?: string;
  }> {
    const job = await this.renderQueue.getJob(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    const state = await job.getState();
    const progress = await job.progress();

    return {
      status: state === 'completed' ? 'completed' : state === 'failed' ? 'failed' : 'processing',
      progress,
      result: state === 'completed' ? job.returnvalue : undefined,
      error: state === 'failed' ? job.failedReason : undefined,
    };
  }

  private async uploadToS3(
    file: Buffer,
    key: string,
    contentType: string,
  ): Promise<string> {
    await this.s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file,
        ContentType: contentType,
      })
      .promise();

    return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
  }
} 