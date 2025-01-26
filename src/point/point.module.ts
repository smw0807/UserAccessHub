import { forwardRef, Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PointResolver } from './point.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { PointController } from './point.controller';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [PointService, PointResolver],
  exports: [PointService],
  controllers: [PointController],
})
export class PointModule {}
