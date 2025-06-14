import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { RenderController } from './render.controller';
import { RenderService } from './render.service';
import { RenderProcessor } from './render.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BullModule.registerQueue({
      name: 'render',
    }),
  ],
  controllers: [RenderController],
  providers: [RenderService, RenderProcessor],
  exports: [RenderService],
})
export class RenderModule {} 