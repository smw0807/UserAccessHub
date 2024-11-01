import { Logger } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { EmailSignInResult } from './models/auth.model';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => EmailSignInResult, {
    nullable: true,
    description: '이메일 로그인',
  })
  async emailSignIn(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<EmailSignInResult> {
    try {
      // 회원 정보 확인
      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        throw new Error('가입되지 않은 이메일입니다.');
      }
      // 비밀번호 확인
      const isPasswordValid = await this.userService.verifyPassword(
        email,
        password,
      );
      if (!isPasswordValid) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      // 토큰 발급
      const { accessToken, refreshToken } =
        await this.authService.makeTokens(user);
      return {
        success: true,
        message: '이메일 로그인 성공',
        token: {
          accessToken,
          refreshToken,
        },
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
