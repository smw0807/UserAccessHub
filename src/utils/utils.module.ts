import { Module } from '@nestjs/common';
import { AuthUtils } from './auth.utils';

@Module({
  imports: [],
  providers: [AuthUtils],
  exports: [AuthUtils],
})
export class UtilsModule {}
