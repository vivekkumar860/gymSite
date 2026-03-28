import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters';
import { LoggingInterceptor } from './common/interceptors';
import { validateEnv } from './config';

async function bootstrap(): Promise<void> {
  // Fail fast if env vars are invalid
  validateEnv();

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Security headers
  app.use(helmet());

  // Body size limits
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
  });

  // Global filters and interceptors
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}

bootstrap();
