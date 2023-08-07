import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { CustomIoAdapter } from './custom.io.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors();
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('html');
  app.useWebSocketAdapter(new CustomIoAdapter(app));

  await app.listen(3002);
}
bootstrap();
