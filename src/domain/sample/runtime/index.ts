// src/domain/sample/runtime/index.ts
// Service 로직을 실제로 환경(브라우저, 데몬 런타임 등)에서 동작하게 감싸는(Bootstrapping) 계층입니다.
// 구체적인 Service, Repo 객체를 조합하여 인스턴스화하고 의존성을 조립합니다.

import { SampleService } from '../service';
import { SampleRepo } from '../repo';
import { GlobalTelemetry } from '../../../providers';

export function initializeSampleDomain() {
  const repo = new SampleRepo();
  const service = new SampleService(repo);
  
  GlobalTelemetry.log("SampleDomain initialized", { time: Date.now() });

  return service;
}
