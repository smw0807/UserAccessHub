import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PointService],
  exports: [PointService],
})
export class PointModule {}
