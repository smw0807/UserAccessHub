import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { UserSearchInput } from './input/search.input';

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

  @Get('/')
  async findAllUser(@Query() query: UserSearchInput, @Res() res: Response) {
    try {
      console.log(query);
      const result = await this.userService.findAllUser(query);
      return res.status(200).json({
        success: true,
        message: '회원 목록 조회 성공',
        user: result,
      });
    } catch (e) {
      this.logger.error(`회원 목록 조회 실패: ${e}`);
      return res.status(500).json({ success: false, message: e.message });
    }
  }
}
