import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Counter } from './counter.entity';
import { CounterController } from './counter.controller';
import { CounterGateway } from './counter.gateway';
import { CounterService } from './counter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Counter])],
  providers: [CounterService, CounterGateway],
  controllers: [CounterController],
})
export class CounterModule {}
