import { Field, ObjectType } from '@nestjs/graphql';
import { ResultModel } from 'src/common/result.model';

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
@ObjectType({ description: '이메일 로그인 결과' })
export class EmailSignInResult extends ResultModel {
  @Field(() => Token, { nullable: true, description: ' 토큰' })
  token?: Token;
}
