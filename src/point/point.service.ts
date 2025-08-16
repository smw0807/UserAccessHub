import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PointHistorySearchInput } from './input/point.input';

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
      // 히스토리에서 오늘 날짜에 생성된 히스토리가 있는지 확인
      const today = new Date();
      const todayPointHistory = await this.prisma.pointHistory.findFirst({
        where: {
          userId,
          createdAt: {
            gte: new Date(today.setHours(0, 0, 0, 0)),
            lte: new Date(today.setHours(23, 59, 59, 999)),
          },
        },
      });
      // 이미 있으면 적립하지 않음
      if (todayPointHistory) {
        this.logger.log(`오늘 날짜에 이미 적립금 생성됨`);
        return;
      }

      // userId 로 생성된 포인트 데이터가 있는지 확인 (있으면 update, 없으면 create)
      const pointOrigin = await this.prisma.point.findFirst({
        where: { userId },
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
            user: { connect: { id: userId } },
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
        pointOrigin: { connect: { id: pointOriginId } },
        user: { connect: { id: userId } },
      },
    });
    this.logger.log(`적립금 히스토리 생성 성공: ${pointHistory.id}`);
  }

  /**
   * 적립금 히스토리 목록 조회
   * @param keyword
   * @param page
   * @param size
   * @returns
   */
  async getPointHistoryList(input: PointHistorySearchInput) {
    const { keyword, page, size } = input;
    const totalCount = await this.prisma.pointHistory.count({
      where: {
        OR: [
          { reason: { contains: keyword } },
          { user: { email: { contains: keyword } } },
        ],
      },
    });
    if (totalCount === 0) {
      return { pointHistoryList: [], totalCount };
    }
    const pointHistoryList = await this.prisma.pointHistory.findMany({
      where: {
        OR: [
          { reason: { contains: keyword } },
          { user: { email: { contains: keyword } } },
        ],
      },
      include: { pointOrigin: true, user: true },
      skip: (page - 1) * size,
      take: size,
      orderBy: { createdAt: 'desc' },
    });

    const result = pointHistoryList.map((pointHistory) => {
      return {
        ...pointHistory,
        totalPoint: pointHistory.pointOrigin.point,
        email: pointHistory.user.email,
      };
    });
    return { pointHistoryList: result, totalCount };
  }
}
