import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthUtils {
  private readonly saltRounds = 10;
  constructor(private readonly configService: ConfigService) {}

  /**
   * 비밀번호 해싱
   * @param password
   * @returns
   */
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      password + this.configService.get('auth.bcryptSalt'),
      this.saltRounds,
    );
  }

  /**
   * 비밀번호 비교
   * @param password
   * @param hashedPassword
   * @returns
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(
      password + this.configService.get('auth.bcryptSalt'),
      hashedPassword,
    );
  }

  /**
   * [400] 이메일, 패스워드 없음
   * @param res
   * @returns
   */
  getNoEmailPasswordResult(res: Response) {
    return res.status(400).send({
      success: false,
      message: '이메일 또는 패스워드가 없습니다.',
    });
  }
  /**
   * [404] 이메일 없음
   * @param res
   * @returns
   */
  getNoEmailResult(res: Response) {
    return res.status(404).send({
      success: false,
      message: '가입되지 않은 이메일입니다.',
    });
  }
  /**
   * [403] 비활성화 회원
   * @param res
   * @returns
   */
  getInactiveUserResult(res: Response) {
    return res.status(403).send({
      success: false,
      message: '현재 비활성화된 회원입니다.\n관리자에게 문의해주세요.',
    });
  }
  /**
   * [401] 비밀번호 불일치
   * @param res
   * @returns
   */
  getPasswordNotMatchResult(res: Response) {
    return res.status(401).send({
      success: false,
      message: '비밀번호가 일치하지 않습니다.',
    });
  }
  /**
   * [401] 유효하지 않은 토큰
   * @param res
   * @returns
   */
  getInvalidTokenResult(res: Response) {
    return res.status(401).send({
      success: false,
      message: '유효하지 않은 토큰입니다.',
    });
  }
}
