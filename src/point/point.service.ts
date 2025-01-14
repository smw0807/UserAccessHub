import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PointService {
  private readonly logger = new Logger(PointService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 적립금 생성
   * @param userId
   * @param point
   * @param reason
   */
  async createPoint(userId: string, point: number, reason?: string) {
    try {
      // userId 로 생성된 포인트 데이터가 있는지 확인 (있으면 update, 없으면 create)
      const pointOrigin = await this.prisma.point.findFirst({
        where: {
          userId,
        },
      });
      if (pointOrigin) {
        await this.updatePoint(
          pointOrigin.id,
          userId,
          pointOrigin.point + point,
          reason,
        );
      } else {
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
      }
      await this.createPointHistory(pointOrigin.id, userId, point, reason);
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }

  /**
   * 적립금 업데이트
   * @param pointOriginId
   * @param userId
   * @param point
   * @param reason
   */
  async updatePoint(
    pointOriginId: string,
    userId: string,
    point: number,
    reason?: string,
  ) {
    await this.prisma.point.update({
      where: { userId },
      data: { point: point, reason: reason },
    });
    this.logger.log(`적립금 업데이트 성공: ${pointOriginId}`);
  }

  /**
   * 적립금 히스토리 생성
   * @param pointOriginId
   * @param userId
   * @param point
   * @param reason
   */
  async createPointHistory(
    pointOriginId: string,
    userId: string,
    point: number,
    reason?: string,
  ) {
    const pointHistory = await this.prisma.pointHistory.create({
      data: {
        point: point,
        reason: reason,
        pointOrigin: {
          connect: {
            id: pointOriginId,
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
  }
}
