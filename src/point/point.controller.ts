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
      const { keyword, page, size } = input;
      if (!page || !size) {
        return res.status(400).send({
          success: false,
          message: '페이지 번호와 페이지 크기는 필수 입니다.',
        });
      }
      let pageNumber = page;
      let pageSize = size;
      if (typeof page === 'string') {
        pageNumber = parseInt(page);
      }
      if (typeof size === 'string') {
        pageSize = parseInt(size);
      }
      const result = await this.pointService.getPointHistoryList({
        keyword,
        page: pageNumber,
        size: pageSize,
      });
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
