import { Field, ObjectType } from '@nestjs/graphql';
import { ResultModel } from 'src/common/result.model';

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

@ObjectType({ description: '적릭급 히스토리 조회 모델' })
export class PointHistorySearchModel extends PointHistoryModel {
  @Field({ description: '적립금 히스토리 유저 ID' })
  userId: string;
  @Field({ description: '적립금 히스토리 유저 이메일' })
  email: string;
  @Field({ description: '적립금 히스토리 원본 포인트', defaultValue: 0 })
  totalPoint: number;
}

@ObjectType({ description: '적립금 히스토리 결과' })
export class PointHistoryResult extends ResultModel {
  @Field(() => [PointHistorySearchModel], {
    description: '적립금 히스토리 목록',
  })
  list: PointHistorySearchModel[];

  @Field({ description: '적립금 히스토리 총 개수' })
  totalCount: number;
}
