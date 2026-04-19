# 하네스_식단표: 시스템 설계 (Design Doc)

## 1. 목적 및 비전
본 시스템은 "하네스 엔지니어링 시스템"의 핵심 철학인 **Agent-First** 아키텍처를 기반으로 설계되었습니다. 사용자가 일상적인 식단을 효율적으로 관리하고, 노션(Notion)을 통해 데이터를 안전하게 저장하며, 에이전트(AI)가 이를 이해하고 가공하기 최적화된 구조를 지향합니다.

## 2. 핵심 아키텍처 (Layered Domain Architecture)

시스템은 다음과 같은 고정된 계층 구조를 따릅니다.

### 1) Types (타입 계층)
- `DietEntry`, `MealType` 등 도메인 모델 정의
- 외부 의존성 없음 (Pure TS)

### 2) Config (설정 계층)
- 노션 데이터베이스 ID, API 엔드포인트 등 도메인별 설정값

### 3) Repo (저장소 계층)
- Notion SDK 또는 API를 통한 물리적 데이터 입출력
- 도메인 전용 리포지토리 패턴 적용

### 4) Service (서비스 계층)
- "오늘의 추천 식단", "영양 분석" 등 핵심 비즈니스 로직
- 저장소(Repo)를 활용하여 상위 런타임에 데이터 전달

### 5) Runtime (런타임 계층)
- UI 상태 관리 (React Context, Hooks 등)
- 서비스 레이어와 UI를 연결하는 인터페이스

### 6) UI (프레젠테이션 계층)
- React 컴포넌트, TailwindCSS 기반 스타일링
- 로직 없이 전달받은 상태만 렌더링

## 3. 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS, Framer Motion (고급 애니메이션)
- **Icons**: Lucide React
- **Data Source**: Notion API
- **Verification**: Playwright, LogQL

## 4. 데이터 모델 (Notion Database Schema)
- **날짜 (Date)**: 식단 일자
- **구분 (Select)**: 아침 / 점심 / 저녁 / 간식
- **메뉴 (Title)**: 주 메뉴명
- **상세 (Rich Text)**: 재료, 칼로리 등 추가 정보
- **완료여부 (Checkbox)**: 식사 완료 확인
