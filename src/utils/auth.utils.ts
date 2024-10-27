import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthUtils {
  private readonly saltRounds = 10;
  constructor(private readonly configService: ConfigService) {}

  // 비밀번호 해싱
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      password + this.configService.get('auth.bcryptSalt'),
      this.saltRounds,
    );
  }

  // 비밀번호 비교
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    console.log(this.configService.get('auth.bcryptSalt'));
    return await bcrypt.compare(
      password + this.configService.get('auth.bcryptSalt'),
      hashedPassword,
    );
  }
}
