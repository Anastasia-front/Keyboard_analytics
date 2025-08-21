import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Counter } from './counter.entity';

import { KeyStatsDto } from './dto/key-stats.dto';

@Injectable()
export class CounterService {
  constructor(
    @InjectRepository(Counter)
    private counterRepo: Repository<Counter>,
  ) {}

  async getAll(): Promise<KeyStatsDto[]> {
    const counters = await this.counterRepo.find({ order: { count: 'DESC' } });
    return counters.map((c) => this.toDto(c));
  }

  async getByKey(key: string): Promise<KeyStatsDto> {
    let counter = await this.counterRepo.findOne({ where: { key } });
    if (!counter) {
      counter = this.counterRepo.create({ key, count: 0 });
      await this.counterRepo.save(counter);
    }

    const allCounters = await this.counterRepo.find({
      order: { count: 'DESC' },
    });
    const index = allCounters.findIndex((c) => c.key === counter.key);

    return this.toDto(counter, {
      prevKey: index > 0 ? allCounters[index - 1].key : null,
      nextKey:
        index < allCounters.length - 1 ? allCounters[index + 1].key : null,
    });
  }

  async increment(key: string): Promise<KeyStatsDto[]> {
    const counter = await this.counterRepo.findOne({ where: { key } });
    if (!counter) {
      const newCounter = this.counterRepo.create({ key, count: 1 });
      await this.counterRepo.save(newCounter);
    } else {
      counter.count += 1;
      await this.counterRepo.save(counter);
    }

    return this.getAll();
  }

  async delete(key: string): Promise<void> {
    await this.counterRepo.delete({ key });
  }

  private toDto(
    counter: Counter,
    extras?: { prevKey?: string | null; nextKey?: string | null },
  ): KeyStatsDto {
    return {
      keyName: counter.key,
      count: counter.count,
      prevKey: extras?.prevKey ?? null,
      nextKey: extras?.nextKey ?? null,
    };
  }
}
