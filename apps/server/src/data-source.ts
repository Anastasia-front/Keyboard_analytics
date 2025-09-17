import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Counter } from './counter/counter.entity';
// import { User } from './user/user.entity';

// Load .env (for local dev)
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Supabase connection string
  entities: [/* User, */ Counter], // add all your entities here
  migrations: ['dist/migrations/*.js'], // compiled migrations
  synchronize: false, // NEVER true in production
  ssl: {
    rejectUnauthorized: false, // required for Supabase
  },
});
