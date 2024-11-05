import { Logger, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { EmailSignInResult } from './models/auth.model';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import { CurrentUser } from './decorator/current.user';
import { ResultModel } from 'src/common/result.model';

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
      const { access_token, refresh_token } =
        await this.authService.makeTokens(user);
      return {
        success: true,
        message: '이메일 로그인 성공',
        token: {
          access_token: access_token,
          refresh_token: refresh_token,
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

  @UseGuards(AuthGuard)
  @Query(() => ResultModel, { description: 'ADMIN 유저 여부 체크' })
  async checkAdminUser(@CurrentUser() user: any) {
    if (user.role === 'ADMIN') {
      return {
        success: true,
        message: 'ADMIN 유저입니다.',
      };
    }
    return {
      success: false,
      message: 'ADMIN 유저가 아닙니다.',
    };
  }

  @UseGuards(AuthGuard)
  @Query(() => ResultModel, {
    nullable: true,
    description: '토큰 검증',
  })
  async verifyToken(@CurrentUser() user: any) {
    console.log('user: ', user);
    if (user) {
      return {
        success: true,
        message: '토큰 검증 성공',
      };
    }
    return {
      success: false,
      message: '토큰 검증 실패',
    };
  }
}
