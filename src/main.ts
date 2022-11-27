import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.AUTH_REST_PORT || 3000);

  logger.log(
    `HTTP service running on port: ${process.env.AUTH_REST_PORT || 3000}`,
  );
}
bootstrap();
