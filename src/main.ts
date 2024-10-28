import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(LoggerService);

  const configService = app.get(ConfigService);

  // prefix
  app.setGlobalPrefix('api');

  const corsConfig = configService.get('cors');
  app.enableCors({
    origin: corsConfig.origin,
    methods: corsConfig.methods,
    allowedHeaders: corsConfig.allowedHeaders,
  });

  const commonConfig = configService.get('common');

  const port = +commonConfig.appPort;
  LoggerService.log(`Port: ${port}`);
  await app.listen(port);
}
bootstrap();
