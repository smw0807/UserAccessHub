import { Field, InputType } from '@nestjs/graphql';
import { Role, Status } from '@prisma/client';

@InputType({ description: '회원 가입 정보' })
export class SignUpInput {
  @Field({ description: '사용자 이메일' })
  email: string;

  @Field({ description: '사용자 이름' })
  name: string;

  @Field({ description: '사용자 비밀번호' })
  password: string;
}

@InputType({ description: '소셜 로그인 회원 가입 정보' })
export class SocialSignUpInput {
  @Field({ description: '사용자 이메일' })
  email: string;

  @Field({ description: '사용자 이름' })
  name: string;

  @Field({ description: '소셜 로그인 회원 타입' })
  type: string;

  @Field({ description: '사용자 프로필 이미지' })
  profileImage: string;
}

@InputType({ description: '회원 추가 정보' })
export class AddUserInput {
  @Field({ description: '사용자 이메일' })
  email: string;

  @Field({ description: '사용자 이름' })
  name: string;

  @Field({ description: '사용자 휴대폰번호' })
  phoneNumber: string;

  @Field({ description: '사용자 비밀번호' })
  password: string;

  @Field({ description: '사용자 상태' })
  status: Status;

  @Field({ description: '사용자 권한' })
  role: Role;
}
