import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(process.env.AUTH_REST_PORT || 3000);

  logger.log(
    `HTTP service running on port: ${process.env.AUTH_REST_PORT || 3000}`,
  );
}
bootstrap();
