import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { SignUpInput } from './input/signup.input';
import { UserResult } from './model/user.model';
import { ResultModel } from 'src/common/result.model';

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
  @Query(() => UserResult, { nullable: true, description: '회원 정보 조회' })
  async findUserByEmail(@Args('email') email: string): Promise<UserResult> {
    try {
      const result = await this.userService.findUser(email);
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
