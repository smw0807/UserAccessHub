import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({ description: '회원 목록 조회 필터' })
export class UserSearchInput {
  @Field(() => Int, { nullable: true, description: '페이지 사이즈' })
  pageSize?: number;

  @Field(() => Int, { nullable: true, description: '페이지 인덱스' })
  pageIndex?: number;

  @Field(() => String, { nullable: true, description: '검색어' })
  keyword?: string;
}
