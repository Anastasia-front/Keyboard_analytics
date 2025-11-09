import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService); // get ConfigService instance

  app.enableCors({
    origin: config.get<string>('FRONT_BASE_URL') ?? 'http://localhost:3000',
    credentials: true,
  });

  const jwtSecret = config.get<string>('JWT_SECRET') ?? 'default-secret';
  app.use(cookieParser(jwtSecret));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  console.log('CORS origin:', config.get<string>('FRONT_BASE_URL'));

  await app.listen(config.get<number>('PORT') ?? 4000);
}
bootstrap();
