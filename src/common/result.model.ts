import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '결과' })
export class ResultModel {
  @Field({ description: '성공 여부' })
  success: boolean;
  @Field({ description: '결과 메시지' })
  message: string;
}
