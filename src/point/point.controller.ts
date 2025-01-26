import { Controller, Get, Logger, Query, Res } from '@nestjs/common';
import { PointService } from './point.service';
import { PointHistorySearchInput } from './input/point.input';
import { Response } from 'express';

@Controller('point')
export class PointController {
  private readonly logger = new Logger(PointController.name);
  constructor(private readonly pointService: PointService) {}

  @Get('history')
  async getPointHistoryList(
    @Query() input: PointHistorySearchInput,
    @Res() res: Response,
  ) {
    try {
      const result = await this.pointService.getPointHistoryList(input);
      return res.send({
        success: true,
        message: '적립금 히스토리 목록 조회 성공',
        data: result,
      });
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send({
        success: false,
        message: e.message,
      });
    }
  }
}
