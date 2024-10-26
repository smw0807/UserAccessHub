import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '회원 가입 정보' })
export class SignUpInput {
  @Field({ description: '사용자 이메일' })
  email: string;

  @Field({ description: '사용자 이름' })
  name: string;

  @Field({ description: '사용자 비밀번호' })
  password: string;
}
