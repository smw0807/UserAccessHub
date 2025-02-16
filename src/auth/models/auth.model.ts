import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role, SIGN_UP_TYPE } from '@prisma/client';
import { ResultModel } from 'src/common/result.model';

registerEnumType(Role, {
  name: 'Role',
  description: '역할',
});

registerEnumType(SIGN_UP_TYPE, {
  name: 'SIGN_UP_TYPE',
  description: '가입 유형',
});

@ObjectType({ description: '토큰' })
export class Token {
  @Field(() => String, { description: '액세스 토큰' })
  access_token: string;
  @Field(() => String, { description: '리프레시 토큰' })
  refresh_token: string;
}

@ObjectType({ description: '토큰 정보' })
export class TokenInfo extends Token {
  @Field(() => String, { description: '토큰 타입' })
  token_type: string;

  @Field(() => String, { description: '만료 시간' })
  expiry_date: number | string;
}

@ObjectType({ description: '토큰 발급 결과' })
export class TokenResult extends ResultModel {
  @Field(() => Token, { nullable: true, description: '토큰' })
  token?: Token;
}

@ObjectType({ description: '토큰 사용자 정보' })
export class TokenUser extends ResultModel {
  @Field(() => String, { description: '이메일' })
  email: string;

  @Field(() => String, { description: '사용자 ID' })
  id: string;

  @Field(() => String, { description: '이름' })
  name: string;

  @Field(() => Role, { description: '역할' })
  role: Role;

  @Field(() => SIGN_UP_TYPE, { description: '가입 유형' })
  type: SIGN_UP_TYPE;

  @Field(() => String, { nullable: true, description: '프로필 이미지' })
  profileImage?: string;

  @Field(() => String, { nullable: true, description: '액세스 토큰' })
  access_token?: string;

  @Field(() => String, { nullable: true, description: '리프레시 토큰' })
  refresh_token?: string;

  @Field(() => String, { nullable: true, description: '토큰 타입' })
  token_type?: string;
}

@ObjectType({ description: '토큰 검증 결과' })
export class VerifyTokenResult extends ResultModel {
  @Field(() => TokenUser, { nullable: true, description: '토큰 사용자 정보' })
  user?: TokenUser;
}
