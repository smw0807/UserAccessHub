import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(LoggerService);

  const configService = app.get(ConfigService);

  const commonConfig = configService.get('common');

  const port = +commonConfig.appPort;
  LoggerService.log(`Port: ${port}`);
  await app.listen(port);
}
bootstrap();
