import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpInput, SocialSignUpInput } from './input/signup.input';
import { UserModel } from './model/user.model';
import { AuthUtils } from 'src/utils/auth.utils';
import { Role, SIGN_UP_TYPE, Status } from '@prisma/client';
import { UserSearchInput } from './input/search.input';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: AuthUtils,
  ) {}

  /**
   * 회원 가입
   * @param input
   * @returns
   */
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

  /**
   * 소셜 로그인 회원 추가
   * @param input
   * @returns
   */
  async addSocialUser(input: SocialSignUpInput): Promise<UserModel> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          type: input.type as SIGN_UP_TYPE,
          profileImage: input.profileImage,
          status: 'ACTIVE',
          role: 'USER',
        },
      });
      this.logger.log(`소셜 로그인 회원 가입 성공: ${user.email}`);
      if (user) {
        const point = await this.prisma.point.create({
          data: {
            point: 10,
            reason: '소셜 회원 가입',
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        this.logger.log(`적립금 생성 성공: ${point.id}`);
        const pointHistory = await this.prisma.pointHistory.create({
          data: {
            point: 10,
            reason: '소셜 회원 가입',
            pointOrigin: {
              connect: {
                id: point.id,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        this.logger.log(`적립금 히스토리 생성 성공: ${pointHistory.id}`);
      }
      return user;
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }

  /**
   * 마지막 로그인 시간 업데이트
   * @param email
   */
  async updateLastLogin(email: string) {
    await this.prisma.user.update({
      where: { email },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * 비밀번호 확인
   * @param email
   * @param password
   * @returns
   */
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

  /**
   * 회원 정보 조회
   * @param email
   * @returns
   */
  async findUserByEmail(email: string): Promise<UserModel> {
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

  /**
   * 회원 목록 조회
   * @param filter
   * @returns
   */
  async findAllUser(filter: UserSearchInput) {
    const totalCount = await this.prisma.user.count({
      where: {
        OR: [
          { email: { contains: filter.keyword } },
          { name: { contains: filter.keyword } },
        ],
      },
    });
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: filter.keyword } },
          { name: { contains: filter.keyword } },
        ],
      },
      skip: (filter.pageIndex - 1) * filter.pageSize,
      take: filter.pageSize,
    });
    return { totalCount, users };
  }

  /**
   * 회원 휴대폰 번호 저장
   * @param email
   * @param phoneNumber
   * @returns
   */
  async savePhoneNumber(email: string, phoneNumber: string) {
    return await this.prisma.user.update({
      where: { email },
      data: { phoneNumber },
    });
  }

  /**
   * 회원 휴대폰 번호 조회
   * @param phoneNumber
   * @returns
   */
  async findPhoneNumberByPhoneNumber(phoneNumber: string): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: { phoneNumber },
    });
    return user?.phoneNumber ?? null;
  }

  /**
   * 이메일 유무 확인
   * @param email
   * @returns
   */
  async isEmailExist(email: string): Promise<boolean> {
    const user = await this.prisma.user.count({
      where: { email },
    });
    return user > 0;
  }

  /**
   * 회원 상태 변경
   * @param email
   * @param status
   * @returns
   */
  async updateUserStatus(email: string, status: string): Promise<boolean> {
    // 이메일 유무 확인
    if (!this.isEmailExist(email)) {
      throw new Error('이메일이 존재하지 않습니다.');
    }
    // 상태 변경
    const result = await this.prisma.user.update({
      where: { email },
      data: { status: Status[status] },
    });
    if (result) {
      this.logger.log(`회원 상태 변경 성공: ${email} -> ${status}`);
      return true;
    }
    this.logger.error(`회원 상태 변경 실패: ${email} -> ${status}`);
    return false;
  }

  /**
   * 회원 권한 변경
   * @param email
   * @param role
   * @returns
   */
  async updateUserRole(email: string, role: string): Promise<UserModel> {
    // 이메일 유무 확인
    if (!this.isEmailExist(email)) {
      throw new Error('이메일이 존재하지 않습니다.');
    }
    // 권한 변경
    const result = await this.prisma.user.update({
      where: { email },
      data: { role: Role[role] },
    });
    if (result) {
      this.logger.log(`회원 권한 변경 성공: ${email} -> ${role}`);
      return result;
    }
    this.logger.error(`회원 권한 변경 실패: ${email} -> ${role}`);
    return null;
  }
}
