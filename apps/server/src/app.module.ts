import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CounterModule } from './counter/counter.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }, // required for Supabase
      autoLoadEntities: true, // <- loads Counter automatically
      synchronize: true, // <- should create the table
    }),
    CounterModule,
  ],
})
export class AppModule {}
