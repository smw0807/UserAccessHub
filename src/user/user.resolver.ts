import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { AddUserInput, SignUpInput } from './input/signup.input';
import { UserListResult, UserResult } from './model/user.model';
import { ResultModel } from 'src/common/result.model';
import { AuthGqlGuard } from 'src/auth/guard/auth.gql.guard';
import { CurrentUser } from 'src/auth/decorator/current.user.gql';
import { TokenUser } from 'src/auth/models/auth.model';
import { Role } from '@prisma/client';
import { UserSearchInput } from './input/search.input';

@Resolver()
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);
  constructor(private readonly userService: UserService) {}

  // 회원 가입
  @Mutation(() => UserResult, { nullable: true, description: '회원 가입' })
  async signUp(@Args('input') input: SignUpInput): Promise<UserResult> {
    try {
      const result = await this.userService.signUp(input);
      return {
        success: true,
        message: '회원 가입 성공',
        user: result,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  }

  // 회원 추가
  @Mutation(() => UserResult, { nullable: true, description: '회원 추가' })
  async addUser(@Args('input') input: AddUserInput): Promise<UserResult> {
    try {
      const isEmailExist = await this.userService.isEmailExist(input.email);
      if (isEmailExist) {
        return {
          success: false,
          message: '이미 가입된 이메일입니다.',
        };
      }
      const isPhoneNumberExist =
        await this.userService.findPhoneNumberByPhoneNumber(input.phoneNumber);
      if (isPhoneNumberExist) {
        return {
          success: false,
          message: '이미 등록된 휴대폰 번호입니다.',
        };
      }
      const result = await this.userService.addUser(input);
      return {
        success: true,
        message: '회원 추가 성공',
        user: result,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  }

  // 비밀번호 확인
  @Query(() => ResultModel, { nullable: true, description: '비밀번호 확인' })
  async verifyPassword(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<ResultModel> {
    try {
      const result = await this.userService.verifyPassword(email, password);
      return {
        success: result,
        message: result ? '비밀번호 확인 성공' : '비밀번호 확인 실패',
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  }

  // 회원 정보 조회
  @UseGuards(AuthGqlGuard)
  @Query(() => UserResult, { nullable: true, description: '회원 정보 조회' })
  async findUserByEmail(
    @CurrentUser() user: TokenUser,
    @Args('email', { nullable: true }) email?: string,
  ): Promise<UserResult> {
    try {
      const result = await this.userService.findUserByEmail(
        email ? email : user.email,
      );
      return {
        success: result ? true : false,
        message: result ? '회원 정보 조회 성공' : '회원 정보 조회 실패',
        user: result,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  }

  // 회원 휴대폰 번호 저장
  @UseGuards(AuthGqlGuard)
  @Mutation(() => ResultModel, {
    nullable: true,
    description: '회원 휴대폰 번호 저장',
  })
  async savePhoneNumber(
    @CurrentUser() user: TokenUser,
    @Args('phoneNumber') phoneNumber: string,
    @Args('email', { nullable: true }) email?: string,
  ) {
    try {
      // 휴대폰 번호 등록된게 있는지 확인
      const isPhoneNumberExist =
        await this.userService.findPhoneNumberByPhoneNumber(phoneNumber);
      if (isPhoneNumberExist) {
        return {
          success: false,
          message: '이미 등록된 휴대폰 번호입니다.',
        };
      }
      const result = await this.userService.savePhoneNumber(
        email ? email : user.email,
        phoneNumber,
      );
      if (result) {
        return {
          success: true,
          message: '휴대폰 번호 등록 성공',
        };
      }
      return {
        success: false,
        message: '휴대폰 번호 등록 실패',
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  }

  // 회원 목록 조회
  @UseGuards(AuthGqlGuard)
  @Query(() => UserListResult, {
    nullable: true,
    description: '회원 목록 조회',
  })
  async findAllUsers(
    @CurrentUser() user: TokenUser,
    @Args('filter') filter: UserSearchInput,
  ) {
    try {
      if (user.role !== Role.ADMIN) {
        return {
          success: false,
          message: '권한이 없습니다.',
        };
      }
      const result = await this.userService.findAllUser(filter);
      return {
        success: true,
        message: '회원 목록 조회 성공',
        totalCount: result.totalCount,
        users: result.users,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  }

  // 회원 상태 변경
  @UseGuards(AuthGqlGuard)
  @Mutation(() => ResultModel, { description: '회원 상태 변경' })
  async updateUserStatus(
    @Args('email') email: string,
    @Args('status') status: string,
  ) {
    try {
      const result = await this.userService.updateUserStatus(email, status);
      if (result) {
        return {
          success: true,
          message: '회원 상태 변경 성공',
        };
      }
      return {
        success: false,
        message: '회원 상태 변경 실패',
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  }

  // 회원 권한 변경
  @UseGuards(AuthGqlGuard)
  @Mutation(() => ResultModel, { description: '회원 권한 변경' })
  async updateUserRole(
    @Args('email') email: string,
    @Args('role') role: string,
  ) {
    try {
      const result = await this.userService.updateUserRole(email, role);
      if (result) {
        return {
          success: true,
          message: '회원 권한 변경 성공',
        };
      }
      return {
        success: false,
        message: '회원 권한 변경 실패',
      };
    } catch (e) {
      this.logger.error(e);
      return {
        success: false,
        message: e.message,
      };
    }
  }
}
