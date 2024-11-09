import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { SignUpInput } from './input/signup.input';
import { UserResult } from './model/user.model';
import { ResultModel } from 'src/common/result.model';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/auth/decorator/current.user';
import { TokenUser } from 'src/auth/models/auth.model';

@Resolver()
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);
  constructor(private readonly userService: UserService) {}

  // 회원 가입
  @Mutation(() => UserResult, { nullable: true, description: '회원 가입' })
  async signUp(@Args('input') input: SignUpInput): Promise<UserResult> {
    try {
      const result = await this.userService.signUp(input);
      return {
        success: true,
        message: '회원 가입 성공',
        user: result,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  }

  // 비밀번호 확인
  @Query(() => ResultModel, { nullable: true, description: '비밀번호 확인' })
  async verifyPassword(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<ResultModel> {
    try {
      const result = await this.userService.verifyPassword(email, password);
      return {
        success: result,
        message: result ? '비밀번호 확인 성공' : '비밀번호 확인 실패',
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  }

  // 회원 정보 조회
  @UseGuards(AuthGuard)
  @Query(() => UserResult, { nullable: true, description: '회원 정보 조회' })
  async findUserByEmail(@CurrentUser() user: TokenUser): Promise<UserResult> {
    try {
      const result = await this.userService.findUserByEmail(user.email);
      return {
        success: result ? true : false,
        message: result ? '회원 정보 조회 성공' : '회원 정보 조회 실패',
        user: result,
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
