import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmotionController } from './emotion.controller';
import { EmotionService } from './emotion.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [EmotionController],
  providers: [EmotionService],
  exports: [EmotionService],
})
export class EmotionModule {} 