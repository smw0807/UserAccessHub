import { Body, Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { Status } from '@prisma/client';
import { AuthUtils } from 'src/utils/auth.utils';
import { PointService } from 'src/point/point.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly authUtils: AuthUtils,
    private readonly pointService: PointService,
  ) {}

  // 이메일 로그인
  @Post('login')
  async signinEmail(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`이메일 로그인 요청: ${body.email}`);
      const { email, password } = body;
      if (!email || !password) {
        return this.authUtils.getNoEmailPasswordResult(res);
      }
      // 회원 정보 확인
      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        return this.authUtils.getNoEmailResult(res);
      }
      if (user.status === Status.INACTIVE) {
        return this.authUtils.getInactiveUserResult(res);
      }
      if (user.password === null) {
        return this.authUtils.isSocialUserResult(res);
      }

      // 비밀번호 확인
      const isPasswordValid = await this.userService.verifyPassword(
        email,
        password,
      );
      if (!isPasswordValid) {
        return this.authUtils.getPasswordNotMatchResult(res);
      }

      // 마지막 로그인 시간 업데이트
      await this.userService.updateLastLogin(email);
      // 적립금 생성
      await this.pointService.createPoint(user.id, 5, '이메일 로그인');
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
        return this.authUtils.getInvalidTokenResult(res);
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
        return this.authUtils.getInvalidTokenResult(res);
      }
      const user = await this.userService.findUserByEmail(decoded.email);
      if (!user) {
        return this.authUtils.getNoEmailResult(res);
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
}
