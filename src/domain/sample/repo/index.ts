// src/domain/sample/repo/index.ts
// 데이터 저장소/외부 API 접근(Repository) 계층입니다.
// Model 생성을 위한 Config나 Types에만 의존합니다.

import { SampleType } from '../types';

export class SampleRepo {
  async fetchSample(id: string): Promise<SampleType> {
    return { id, name: "Sample Agent" };
  }
}
