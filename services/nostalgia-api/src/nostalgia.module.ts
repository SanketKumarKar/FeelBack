import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NostalgiaController } from './nostalgia.controller';
import { NostalgiaService } from './nostalgia.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [NostalgiaController],
  providers: [NostalgiaService],
  exports: [NostalgiaService],
})
export class NostalgiaModule {} 