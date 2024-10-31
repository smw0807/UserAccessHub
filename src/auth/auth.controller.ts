import { Controller, Get, Logger, Param, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGoogleService } from './auth.google.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  @Get('test')
  async test(@Req() req: Request, @Res() res: Response) {
    return res.status(200).send('test');
  }

  @Get('signin/google')
  async signinGoogle(@Req() req: Request, @Res() res: Response) {
    try {
      const url = await this.authGoogleService.getGoogleAuthUrl();
      return res.send(url);
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }

  @Get('signin/kakao')
  async signinKakao(@Req() req: Request, @Res() res: Response) {
    return res.status(200).send('kakao');
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
