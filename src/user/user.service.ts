import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpInput } from './input/signup.input';
import { UserModel } from './model/user.model';
import { AuthUtils } from 'src/utils/auth.utils';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: AuthUtils,
  ) {}

  // 회원 가입
  async signUp(input: SignUpInput): Promise<UserModel> {
    try {
      const isEmailExist = await this.isEmailExist(input.email);
      if (isEmailExist) {
        throw '이미 가입된 이메일입니다.';
      }
      const user = await this.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: await this.utils.hashPassword(input.password),
        },
      });
      this.logger.log(`회원 가입 성공: ${user.email}`);
      return user;
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }
  // 비밀번호 확인
  async verifyPassword(email: string, password: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email,
        },
        select: {
          password: true,
        },
      });
      return await this.utils.comparePassword(password, user.password);
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }

  // 회원 정보 조회
  async findUser(email: string): Promise<UserModel> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });
      return user;
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }

  // 회원 정보 수정

  // 이메일 유무 확인
  async isEmailExist(email: string): Promise<boolean> {
    const user = await this.prisma.user.count({
      where: { email },
    });
    return user > 0;
  }
}
