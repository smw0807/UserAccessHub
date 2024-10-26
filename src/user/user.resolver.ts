import { Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { SignUpInput } from './input/signup.input';
import { SignUpResult } from './model/user.model';

@Resolver()
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);
  constructor(private readonly userService: UserService) {}

  // 회원 가입
  @Mutation(() => SignUpResult, { nullable: true, description: '회원 가입' })
  async signUp(@Args('input') input: SignUpInput): Promise<SignUpResult> {
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
}
