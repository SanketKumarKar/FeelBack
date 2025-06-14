import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NostalgiaService } from './nostalgia.service';

@ApiTags('nostalgia')
@Controller('nostalgia')
export class NostalgiaController {
  constructor(private readonly nostalgiaService: NostalgiaService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate nostalgic content' })
  @ApiResponse({ status: 201, description: 'Nostalgic content generated successfully.' })
  async generateNostalgia(
    @Body() data: { emotion: string; era: string; style: string },
  ) {
    return this.nostalgiaService.generateNostalgia(data.emotion, data.era, data.style);
  }

  @Get('history/:userId')
  @ApiOperation({ summary: 'Get user nostalgia history' })
  @ApiResponse({ status: 200, description: 'Nostalgia history retrieved successfully.' })
  async getNostalgiaHistory(@Param('userId') userId: string) {
    return this.nostalgiaService.getNostalgiaHistory(userId);
  }

  @Post('clear-history/:userId')
  @ApiOperation({ summary: 'Clear user nostalgia history' })
  @ApiResponse({ status: 200, description: 'Nostalgia history cleared successfully.' })
  async clearNostalgiaHistory(@Param('userId') userId: string) {
    return this.nostalgiaService.clearNostalgiaHistory(userId);
  }
} 