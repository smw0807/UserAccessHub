import { forwardRef, Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PointResolver } from './point.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [PointService, PointResolver],
  exports: [PointService],
})
export class PointModule {}
