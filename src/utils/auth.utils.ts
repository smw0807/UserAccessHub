import { Injectable } from '@nestjs/common';
import { bcrypt } from 'bcrypt';

@Injectable()
export class AuthUtils {
  private readonly saltRounds = 10;
  constructor() {}

  // 비밀번호 해싱
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  // 비밀번호 비교
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
