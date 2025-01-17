import { Controller, Get, Logger, Query, Req, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { SIGN_UP_TYPE, Status } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthUtils } from 'src/utils/auth.utils';
import { AuthGoogleService } from './auth.google.service';
import { PointService } from 'src/point/point.service';

@Controller('auth/google')
export class AuthGoogleController {
  private readonly logger = new Logger(AuthGoogleController.name);
  constructor(
    private readonly authGoogleService: AuthGoogleService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly authUtils: AuthUtils,
    private readonly pointService: PointService,
  ) {}

  @Get('signin') // 구글 로그인 페이지 이동
  async signinGoogle(@Req() req: Request, @Res() res: Response) {
    try {
      const url = this.authGoogleService.getGoogleAuthUrl();
      return res.send({
        success: true,
        message: '구글 로그인 페이지 이동',
        url: url,
      });
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send({
        success: false,
        message: e.message,
      });
    }
  }

  @Get('callback') // 구글 로그인 콜백
  async callbackGoogle(@Query('code') code: string, @Res() res: Response) {
    try {
      // 구글 로그인 인증 토큰 발급
      const tokens = await this.authGoogleService.getGoogleAuthToken(code);
      // 구글 로그인 유저 정보 조회
      const userData = await this.authGoogleService.getGoogleUser(
        tokens.access_token,
      );

      // 가입된 이메일 있는지 확인
      let user = await this.userService.findUserByEmail(userData.email);
      if (!user) {
        // 소셜 로그인 회원 가입
        await this.userService.addSocialUser({
          email: userData.email,
          name: userData.name,
          type: SIGN_UP_TYPE.GOOGLE,
          profileImage: userData.picture,
        });
        user = await this.userService.findUserByEmail(userData.email);
      }
      if (user.status === Status.INACTIVE) {
        return this.authUtils.getInactiveUserResult(res);
      }
      // 마지막 로그인 시간 업데이트
      await this.userService.updateLastLogin(user.email);
      // 적립금 생성
      await this.pointService.createPoint(user.id, 5, '구글 로그인');
      // 토큰 생성
      const tokenInfo = await this.authService.makeTokens(user, {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
      });

      return res.status(200).send(tokenInfo);
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }
}
