import { Logger, UseGuards } from '@nestjs/common';
import { PointService } from './point.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthGqlGuard } from 'src/auth/guard/auth.gql.guard';
// import { CurrentUser } from 'src/auth/decorator/current.user';
import { PointHistoryResult } from './model/point.model';
import { AuthAdminGuard } from 'src/auth/guard/auth.admin.guard';
import { PointHistorySearchInput } from './input/point.input';
// import { TokenUser } from 'src/auth/models/auth.model';

@Resolver()
export class PointResolver {
  private readonly logger = new Logger(PointResolver.name);
  constructor(private readonly pointService: PointService) {}

  @UseGuards(AuthGqlGuard, AuthAdminGuard)
  @Query(() => PointHistoryResult, {
    nullable: true,
    description: '적립금 히스토리 조회',
  })
  async findPointHistoryList(@Args('input') input: PointHistorySearchInput) {
    try {
      const result = await this.pointService.getPointHistoryList(input);
      return {
        success: true,
        message: '적립금 히스토리 조회 성공',
        list: result.pointHistoryList,
        totalCount: result.totalCount,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  }
}
