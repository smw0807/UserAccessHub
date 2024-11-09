import { Controller, Get, Logger, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGoogleService } from './auth.google.service';
import { UserService } from 'src/user/user.service';
import { SIGN_UP_TYPE, Status } from '@prisma/client';
import { AuthKakaoService } from './auth.kakao.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
    private readonly userService: UserService,
    private readonly authKakaoService: AuthKakaoService,
  ) {}

  @Get('signin/google') // 구글 로그인 페이지 이동
  async signinGoogle(@Req() req: Request, @Res() res: Response) {
    try {
      const url = this.authGoogleService.getGoogleAuthUrl();
      return res.send(url);
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }

  @Get('callback/google') // 구글 로그인 콜백
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
        const socialUser = await this.userService.addSocialUser({
          email: userData.email,
          name: userData.name,
          type: SIGN_UP_TYPE.GOOGLE,
          profileImage: userData.picture,
        });
        this.logger.log(`소셜 로그인 회원 가입 성공: ${socialUser.email}`);
        user = await this.userService.findUserByEmail(userData.email);
      }
      if (user.status === Status.INACTIVE) {
        return res
          .status(400)
          .send('현재 비활성화된 회원입니다.\n관리자에게 문의해주세요.');
      }
      // 토큰 생성
      const tokenInfo = await this.authService.makeTokens(user, {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
      });

      return res.status(200).send(tokenInfo);
    } catch (e) {
      console.log('test : ', e.message);
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }

  @Get('signin/kakao') // 카카오 로그인 페이지 이동
  async signinKakao(@Req() req: Request, @Res() res: Response) {
    try {
      const url = this.authKakaoService.getKakaoAuthUrl();
      return res.status(200).send(url);
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }

  @Get('callback/kakao') // 카카오 로그인 콜백
  async callbackKakao(@Query('code') code: string, @Res() res: Response) {
    try {
      // 카카오 로그인 인증 토큰 발급
      const tokens = await this.authKakaoService.getKakaoAuthToken(code);
      // 카카오 로그인 유저 정보 조회
      const userData = await this.authKakaoService.getKakaoUser(
        tokens.access_token,
        tokens.token_type,
      );
      // 가입된 이메일 있는지 확인
      let user = await this.userService.findUserByEmail(
        userData.kakao_account.email,
      );
      if (!user) {
        // 소셜 로그인 회원 가입
        const socialUser = await this.userService.addSocialUser({
          email: userData.kakao_account.email,
          name: userData.properties.nickname,
          type: SIGN_UP_TYPE.KAKAO,
          profileImage: userData.properties.profile_image,
        });
        this.logger.log(`소셜 로그인 회원 가입 성공: ${socialUser.email}`);
        user = await this.userService.findUserByEmail(
          userData.kakao_account.email,
        );
      }
      if (user.status === Status.INACTIVE) {
        return res
          .status(400)
          .send('현재 비활성화된 회원입니다.\n관리자에게 문의해주세요.');
      }
      // 토큰 생성
      const tokenInfo = await this.authService.makeTokens(user, tokens);

      return res.status(200).send(tokenInfo);
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }
}
