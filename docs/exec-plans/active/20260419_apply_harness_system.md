# [EP-20260419-001] 하네스 엔지니어링 시스템 적용 (식단표 프로젝트)

## 1. 개요
현재 "하네스엔지니어링_할일체크리스트" 프로젝트에서 축척된 "하네스 엔지니어링 시스템"을 "하네스_식단표" 프로젝트에 이식하고 적용합니다.

## 2. 주요 작업 내용
- [x] `AGENTS.md` 업데이트 (전체 버전 적용)
- [x] 레이어드 도메인 아키텍처 구조화 (`src/domain/diet`)
- [x] 프로젝트 기반 설정 (Next.js, Tailwind, Lucide 등 필수 패키지 구성)
- [x] 노션(Notion) 연동 기반 서비스 레이어 구현
- [x] 기본 식단표 UI 프로토타입 개발

## 3. 상세 단계

### 단계 1: 시스템 기반 구축
- `docs/` 내부에 "식단표" 시스템 설계 문서 작성
- `package.json` 고도화 및 의존성 설치

### 단계 2: 도메인 아키텍처 구현
- `src/domain/diet/types`: 식단 데이터 타입 정의
- `src/domain/diet/repo`: 노션 API 연동 저장소
- `src/domain/diet/service`: 비즈니스 로직
- `src/domain/diet/ui`: UI 컴포넌트

### 단계 3: 검증
- Playwright를 이용한 UI 렌더링 검증
- 데이터 연동 테스트

## 4. 진행 상태
- **상태**: 완료 (`completed`)
- **담당**: Antigravity
