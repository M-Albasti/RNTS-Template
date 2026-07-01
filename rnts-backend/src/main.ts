import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdirSync, existsSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const uploadDir = config.get<string>('UPLOAD_DIR', './uploads');
  const dataDir = './data';
  for (const dir of [uploadDir, dataDir]) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  const prefix = config.get<string>('API_PREFIX', 'v1');
  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const corsOrigins = config.get<string>('CORS_ORIGINS', '*');
  app.enableCors({
    origin: corsOrigins === '*' ? true : corsOrigins.split(','),
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('RNTS Backend API')
    .setDescription(
      'REST API for the RNTS-Template React Native application — auth, media, feed, dashboard, and delivery.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`RNTS Backend running on http://localhost:${port}/${prefix}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
