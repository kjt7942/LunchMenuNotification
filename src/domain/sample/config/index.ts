// src/domain/sample/config/index.ts
// 도메인의 런타임 제약이나 환경 상수, 스키마 검증 룰(Schema Validation) 등이 들어갑니다.
import { SampleType } from '../types';

export const SampleConfig = {
  MaxRetries: 3,
  DefaultId: "sample-001"
};
