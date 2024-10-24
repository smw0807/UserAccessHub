import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validationSchema } from './validation.schema';
import commonConfig from './conf/common.config';
import corsConfig from './conf/cors.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
      load: [commonConfig, corsConfig],
      isGlobal: true,
      validationSchema,
    }),
  ],
})
export class ConfigModule {}
