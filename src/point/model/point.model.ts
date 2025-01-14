import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '적립금' })
export class PointModel {
  @Field({ description: '적립금 ID' })
  id: string;

  @Field({ description: '적립금 포인트', defaultValue: 0 })
  point: number;

  @Field({ description: '적립 이유', defaultValue: '' })
  reason: string;

  @Field({ nullable: true, description: '적립금 생성 시간' })
  createdAt?: Date;

  @Field({ nullable: true, description: '적립금 수정 시간' })
  updatedAt?: Date;

  @Field(() => [PointHistoryModel], {
    nullable: true,
    description: '적립금 히스토리',
  })
  pointHistory?: PointHistoryModel[];
}

@ObjectType({ description: '적립금 히스토리' })
export class PointHistoryModel {
  @Field({ description: '적립금 히스토리 ID' })
  id: string;

  @Field({ description: '적립금 히스토리 포인트', defaultValue: 0 })
  point: number;

  @Field({ description: '적립금 히스토리 이유' })
  reason: string;

  @Field({ nullable: true, description: '적립금 히스토리 생성 시간' })
  createdAt?: Date;

  @Field({ nullable: true, description: '적립금 히스토리 수정 시간' })
  updatedAt?: Date;
}
