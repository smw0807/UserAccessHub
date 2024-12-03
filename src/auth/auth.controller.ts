import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
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

  // 이메일, 패스워드 없음 결과
  private getNoEmailPasswordResult(res: Response) {
    return res.status(400).send({
      success: false,
      message: '이메일 또는 패스워드가 없습니다.',
    });
  }
  // 이메일 없음 결과
  private getNoEmailResult(res: Response) {
    return res.status(404).send({
      success: false,
      message: '가입되지 않은 이메일입니다.',
    });
  }
  // 비활성화 회원 결과
  private getInactiveUserResult(res: Response) {
    return res.status(403).send({
      success: false,
      message: '현재 비활성화된 회원입니다.\n관리자에게 문의해주세요.',
    });
  }
  // 비밀번호 불일치 결과
  private getPasswordNotMatchResult(res: Response) {
    return res.status(401).send({
      success: false,
      message: '비밀번호가 일치하지 않습니다.',
    });
  }
  // 유효하지 않은 토큰 결과
  private getInvalidTokenResult(res: Response) {
    return res.status(401).send({
      success: false,
      message: '유효하지 않은 토큰입니다.',
    });
  }

  // 이메일 로그인
  @Post('login')
  async signinEmail(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const { email, password } = body;
      if (!email || !password) {
        return this.getNoEmailPasswordResult(res);
      }
      // 회원 정보 확인
      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        return this.getNoEmailResult(res);
      }
      if (user.status === Status.INACTIVE) {
        return this.getInactiveUserResult(res);
      }

      // 비밀번호 확인
      const isPasswordValid = await this.userService.verifyPassword(
        email,
        password,
      );
      if (!isPasswordValid) {
        return this.getPasswordNotMatchResult(res);
      }

      // 마지막 로그인 시간 업데이트
      await this.userService.updateLastLogin(email);

      // 토큰 발급
      const tokenInfo = await this.authService.makeTokens(user);
      return res.status(200).send({
        success: true,
        message: '이메일 로그인 성공',
        token: tokenInfo,
      });
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }

  // 토큰 검증 (토큰 헤더에 담겨있어야함)
  @Post('verify/token')
  async verifyToken(@Req() req: Request, @Res() res: Response) {
    try {
      // access token 검증
      const decoded = await this.authService.verifyToken(
        req.headers.authorization,
      );
      if (!decoded) {
        return this.getInvalidTokenResult(res);
      }
      return res.status(200).send({
        success: true,
        message: '토큰 검증 성공',
        data: decoded,
      });
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }

  // 토큰 재발급(토큰 헤더에 담겨있어야함)
  @Post('refresh/token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const decoded = await this.authService.verifyToken(
        req.headers.authorization,
      );
      if (!decoded) {
        return this.getInvalidTokenResult(res);
      }
      const user = await this.userService.findUserByEmail(decoded.email);
      if (!user) {
        return this.getNoEmailResult(res);
      }
      const tokenInfo = await this.authService.makeTokens(user);
      return res.status(200).send({
        success: true,
        message: '토큰 재발급 성공',
        token: tokenInfo,
      });
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }

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
        return this.getInactiveUserResult(res);
      }
      // 마지막 로그인 시간 업데이트
      await this.userService.updateLastLogin(user.email);
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
      // 마지막 로그인 시간 업데이트
      await this.userService.updateLastLogin(user.email);
      if (user.status === Status.INACTIVE) {
        return this.getInactiveUserResult(res);
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
