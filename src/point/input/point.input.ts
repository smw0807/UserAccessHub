import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class PointHistorySearchInput {
  @Field(() => String, { nullable: true })
  keyword?: string;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  size?: number;
}
