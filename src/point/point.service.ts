import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PointService {
  private readonly logger = new Logger(PointService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createPoint(userId: string, point: number, reason?: string) {
    try {
      const pointOrigin = await this.prisma.point.create({
        data: {
          point: point,
          reason: reason,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      this.logger.log(`적립금 생성 성공: ${pointOrigin.id}`);
      const pointHistory = await this.prisma.pointHistory.create({
        data: {
          point: point,
          reason: reason,
          pointOrigin: {
            connect: {
              id: pointOrigin.id,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      this.logger.log(`적립금 히스토리 생성 성공: ${pointHistory.id}`);
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }
}
