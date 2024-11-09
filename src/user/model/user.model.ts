import { ObjectType } from '@nestjs/graphql';
import { Role, SIGN_UP_TYPE, Status } from '@prisma/client';
import { Field } from '@nestjs/graphql';
import { ResultModel } from 'src/common/result.model';

@ObjectType({ description: '회원' })
export class UserModel {
  @Field({ description: '사용자 ID' })
  id: string;

  @Field({ description: '사용자 이메일' })
  email: string;

  @Field({ nullable: true, description: '사용자 이름' })
  name?: string;

  @Field({ nullable: true, description: '사용자 비밀번호' })
  password?: string;

  @Field({ description: '가입 유형', defaultValue: SIGN_UP_TYPE.EMAIL })
  type: SIGN_UP_TYPE;

  @Field({ description: '사용자 역할', defaultValue: Role.USER })
  role: Role;

  @Field({ description: '사용자 상태', defaultValue: Status.ACTIVE })
  status: Status;

  @Field({ nullable: true, description: '마지막 로그인 날짜' })
  lastLoginAt?: Date;

  @Field({ nullable: true, description: '프로필 이미지 URL' })
  profileImage?: string;

  @Field({ nullable: true, description: '휴대폰 번호' })
  phoneNumber?: string;

  @Field({ nullable: true, description: '이메일 인증 상태' })
  emailVerified?: boolean;

  @Field({ description: '이중 인증 활성화' })
  twoFactorEnabled: boolean;

  @Field({ nullable: true, description: '비밀번호 재설정 토큰' })
  resetPasswordToken?: string;

  @Field({
    nullable: true,
    description: '비밀번호 재설정 토큰 만료 시간',
  })
  resetPasswordTokenExpires?: Date;

  @Field({ nullable: true, description: '회원 생성 시간' })
  createdAt?: Date;

  @Field({ nullable: true, description: '회원 수정 시간' })
  updatedAt?: Date;
}

@ObjectType({ description: '회원' })
export class UserResult extends ResultModel {
  @Field(() => UserModel, { nullable: true, description: '회원 정보' })
  user?: UserModel;
}
