import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(
    @Body() body: { email: string; password: string; name: string },
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`회원가입 요청: ${body.email}`);
      const result = await this.userService.signUp(body);
      return res
        .status(200)
        .json({ success: true, message: '회원가입 성공', user: result });
    } catch (e) {
      this.logger.error(`회원가입 실패: ${e}`);
      return res.status(500).json({ success: false, message: e.message });
    }
  }
}
