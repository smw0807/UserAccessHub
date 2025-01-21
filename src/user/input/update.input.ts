import { Field, InputType } from '@nestjs/graphql';
import { Role, Status } from '@prisma/client';

@InputType({ description: '회원 업데이트' })
export class UserUpdateInput {
  @Field(() => String, { description: '회원 이름' })
  name: string;

  @Field(() => String, { description: '회원 휴대폰 번호' })
  phoneNumber: string;

  @Field(() => String, { description: '회원 권한' })
  role: Role;

  @Field(() => String, { description: '회원 상태' })
  status: Status;
}
