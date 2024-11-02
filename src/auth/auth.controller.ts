import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGoogleService } from './auth.google.service';
import { UserService } from 'src/user/user.service';
import { SIGN_UP_TYPE } from '@prisma/client';
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

  @Get('signin/google')
  async signinGoogle(@Req() req: Request, @Res() res: Response) {
    try {
      const url = this.authGoogleService.getGoogleAuthUrl();
      return res.send(url);
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }

  @Get('callback/google')
  async callbackGoogle(@Query('code') code: string, @Res() res: Response) {
    try {
      const data = await this.authGoogleService.getGoogleUser(code);
      // 가입된 이메일 있는지 확인
      let user = await this.userService.findUserByEmail(data.email);
      if (!user) {
        // 소셜 로그인 회원 가입
        const socialUser = await this.userService.addSocialUser({
          email: data.email,
          name: data.name,
          type: SIGN_UP_TYPE.GOOGLE,
          profileImage: data.picture,
        });
        this.logger.log(`소셜 로그인 회원 가입 성공: ${socialUser.email}`);
        user = await this.userService.findUserByEmail(data.email);
      }
      const tokens = await this.authService.makeTokens(user);

      return res.status(200).send(tokens);
    } catch (e) {
      console.log('test : ', e.message);
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }

  @Get('signin/kakao')
  async signinKakao(@Req() req: Request, @Res() res: Response) {
    try {
      const url = this.authKakaoService.getKakaoAuthUrl();
      return res.status(200).send(url);
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }

  @Get('callback/:provider')
  async callback(
    @Param('provider') provider: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(typeof provider);
    return res.status(200).send('callback');
  }
}
