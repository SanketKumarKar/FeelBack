import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as ffmpeg from 'fluent-ffmpeg';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

@Processor('render')
export class RenderProcessor {
  private s3: S3;

  constructor() {
    this.initializeServices();
  }

  private async initializeServices() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  @Process('generate-video')
  async handleVideoGeneration(job: Job) {
    const { content, options } = job.data;
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'feelback-'));
    
    try {
      // Download image
      const imagePath = path.join(tempDir, 'image.png');
      await this.downloadFile(content.imageUrl, imagePath);

      // Download music if provided
      let musicPath: string | undefined;
      if (content.musicUrl) {
        musicPath = path.join(tempDir, 'music.mp3');
        await this.downloadFile(content.musicUrl, musicPath);
      }

      // Generate video
      const videoPath = path.join(tempDir, 'output.mp4');
      await this.generateVideo(imagePath, musicPath, videoPath, options);

      // Generate thumbnail
      const thumbnailPath = path.join(tempDir, 'thumbnail.jpg');
      await this.generateThumbnail(videoPath, thumbnailPath);

      // Upload to S3
      const videoUrl = await this.uploadToS3(
        await fs.promises.readFile(videoPath),
        `videos/${Date.now()}-${job.id}.mp4`,
        'video/mp4',
      );

      const thumbnailUrl = await this.uploadToS3(
        await fs.promises.readFile(thumbnailPath),
        `thumbnails/${Date.now()}-${job.id}.jpg`,
        'image/jpeg',
      );

      return { videoUrl, thumbnailUrl };
    } finally {
      // Cleanup
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  }

  @Process('generate-story')
  async handleStoryGeneration(job: Job) {
    const { content, options } = job.data;
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'feelback-'));
    
    try {
      // Download image
      const imagePath = path.join(tempDir, 'image.png');
      await this.downloadFile(content.imageUrl, imagePath);

      // Generate story
      const storyPath = path.join(tempDir, 'story.png');
      await this.generateStory(imagePath, storyPath, content.text, options);

      // Upload to S3
      const storyUrl = await this.uploadToS3(
        await fs.promises.readFile(storyPath),
        `stories/${Date.now()}-${job.id}.png`,
        'image/png',
      );

      return { storyUrl };
    } finally {
      // Cleanup
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  }

  private async downloadFile(url: string, outputPath: string): Promise<void> {
    const response = await fetch(url);
    const buffer = await response.buffer();
    await fs.promises.writeFile(outputPath, buffer);
  }

  private async generateVideo(
    imagePath: string,
    musicPath: string | undefined,
    outputPath: string,
    options: {
      duration: number;
      format: 'tiktok' | 'instagram' | 'story';
      style: string;
    },
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg()
        .input(imagePath)
        .loop(options.duration)
        .size('1080x1920') // Vertical video format
        .videoCodec('libx264')
        .videoBitrate('2000k')
        .fps(30);

      if (musicPath) {
        command.input(musicPath);
      }

      command
        .output(outputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }

  private async generateThumbnail(
    videoPath: string,
    outputPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['00:00:01'],
          filename: path.basename(outputPath),
          folder: path.dirname(outputPath),
          size: '1080x1920',
        })
        .on('end', resolve)
        .on('error', reject);
    });
  }

  private async generateStory(
    imagePath: string,
    outputPath: string,
    text: string,
    options: {
      format: 'instagram' | 'snapchat';
      style: string;
    },
  ): Promise<void> {
    // In a real implementation, this would use a proper image processing library
    // to overlay text and apply filters based on the style
    return new Promise((resolve, reject) => {
      ffmpeg(imagePath)
        .size('1080x1920')
        .output(outputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
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