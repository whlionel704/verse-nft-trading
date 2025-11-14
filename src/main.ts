import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,          // Better logging in production
  });

  // --- Security ---
  app.use(helmet());           // Secure HTTP headers
  app.enableCors();

  // --- Global configuration ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Strip unknown fields
      forbidNonWhitelisted: true,
      transform: true,         // Auto-transform payloads to DTO types
    }),
  );

  // --- Graceful shutdown (important for Docker/Kubernetes) ---
  app.enableShutdownHooks();

  // --- Config service for env variables ---
  const port = app.get(ConfigService).get('PORT');

  await app.listen(port);
  console.log(`🚀 Application running on port ${port}`);
}

bootstrap();