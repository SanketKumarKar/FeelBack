import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmotionController } from './emotion.controller';
import { EmotionService } from './emotion.service';
import { AdvancedEmotionModel } from './models/advanced-emotion.model';
import { TextPreprocessor } from './utils/text-preprocessor';
import { EmotionalContentGenerator } from './generators/emotional-content-generator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    })
  ],
  controllers: [EmotionController],
  providers: [
    EmotionService,
    AdvancedEmotionModel,
    TextPreprocessor,
    EmotionalContentGenerator,
  ],
  exports: [EmotionService],
})
export class EmotionModule {} 