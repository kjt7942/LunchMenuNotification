// src/domain/diet/runtime/index.ts
// 식단 상태 관리 및 실행 환경

import { DietService } from '../service';
import { NotionDietRepository } from '../repo';

// 싱글톤 스타일로 서비스 노출
const dietRepo = new NotionDietRepository();
export const dietService = new DietService(dietRepo);

// 실제 React 환경에서는 Context Provider 등을 통해 주입됩니다.
