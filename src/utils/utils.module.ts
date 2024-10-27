import { Module } from '@nestjs/common';
import { AuthUtils } from './auth.utils';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [AuthUtils],
  exports: [AuthUtils],
})
export class UtilsModule {}
