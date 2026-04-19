// src/domain/sample/ui/index.ts
// 상태 변경에 따른 HTML/React/Vue 등의 프레젠테이션(Presentation) 렌더링만을 담당합니다.
// 이 계층에는 비즈니스 로직 및 상태 변경 로직이 없어야 합니다.

import { SampleType } from '../types';

export function renderSampleUI(data: SampleType) {
  // 실제 프로젝트에서는 JSX/TSX 등 UI 컴포넌트가 위치합니다.
  console.log(`[UI Render] ID: ${data.id}, Name: ${data.name}`);
}
