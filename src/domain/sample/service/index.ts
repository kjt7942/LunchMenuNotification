// src/domain/sample/service/index.ts
// 비즈니스 로직 및 유즈케이스 계층입니다.
// Repo나 Config, Types에만 의존합니다. 역으로 UI를 참조하는 일은 없습니다.

import { SampleRepo } from '../repo';
import { SampleType } from '../types';

export class SampleService {
  constructor(private repo: SampleRepo) {}

  async processSample(id: string): Promise<SampleType> {
    const data = await this.repo.fetchSample(id);
    // 비즈니스 로직 수행
    return data;
  }
}
