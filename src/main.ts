/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = app.getHttpAdapter().getInstance();

  server.set('trust proxy', 1);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: (origin: any, callback: any) => {
      if (!origin) return callback(null, true); // mobile

      const allowed = [
        process.env.FRONTEND_URL,
        'http://localhost:3000',
        'http://localhost:19006',
      ];

      if (allowed.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //remove keys that are not validated in the dto
      forbidNonWhitelisted: true, //When key dont exist up an error
    }),
  );
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
