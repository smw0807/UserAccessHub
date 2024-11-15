import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '토큰' })
export class TokenInput {
  @Field(() => String, { description: '액세스 토큰' })
  access_token: string;

  @Field(() => String, { description: '리프레시 토큰' })
  refresh_token: string;
}
