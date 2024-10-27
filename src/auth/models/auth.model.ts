import { Field, ObjectType } from '@nestjs/graphql';
import { ResultModel } from 'src/common/result.model';

@ObjectType({ description: '토큰' })
export class Token {
  @Field(() => String, { description: '액세스 토큰' })
  accessToken: string;
  @Field(() => String, { description: '리프레시 토큰' })
  refreshToken: string;
}
@ObjectType({ description: '이메일 로그인 결과' })
export class EmailSignInResult extends ResultModel {
  @Field(() => Token, { nullable: true, description: ' 토큰' })
  token?: Token;
}
