import { Controller, Delete, Get, Param } from '@nestjs/common';

import { CounterService } from './counter.service';

import { KeyStatsDto } from './dto/key-stats.dto';

@Controller('counter')
export class CounterController {
  constructor(private counterService: CounterService) {}

  @Get()
  async getStats(): Promise<KeyStatsDto[]> {
    return this.counterService.getAll();
  }

  @Get(':key')
  async getKeyStats(@Param('key') key: string): Promise<KeyStatsDto> {
    return this.counterService.getByKey(key);
  }

  @Delete(':key')
  async deleteKey(@Param('key') key: string) {
    return this.counterService.delete(key);
  }
}
