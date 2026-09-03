# 하네스_식단표 (Harness Diet Menu)

저장소: https://github.com/kjt7942/LunchMenuNotification

문경여중 학교 급식 홈페이지를 크롤링해 매일 아침 오늘의 식단을 이메일로 보내주는 알림 시스템. Next.js 15 기반으로, 식단을 기록/조회하는 개인 다이어트 트래커 UI도 같은 저장소에서 함께 설계되었다.

## 목적

매일 학교 급식 홈페이지에 직접 들어가서 오늘 메뉴를 확인하는 번거로움을 없애기 위해 시작. GitHub Actions로 평일 아침(KST 06:45) 자동 크롤링 후 이메일 발송까지 무인으로 처리하는 것이 핵심 목표.

부가적으로, "하네스 엔지니어링 시스템"(`AGENTS.md`, `docs/design-docs`)이라는 레이어드 도메인 아키텍처 규율을 이 프로젝트에도 이식해 에이전트가 유지보수하기 쉬운 구조로 만드는 것도 목적에 포함됨. 여기서 나아가 Notion을 데이터 저장소로 쓰는 개인 식단 기록/칼로리 관리 기능도 함께 설계.

## 구현하려던 주요 기능

코드 기준으로 실제 동작 여부를 구분하면:

**✅ 동작 (프로덕션 크론으로 운영 중)**
- 학교 급식 홈페이지(`school.gyo6.net`) HTML을 `axios` + `cheerio`로 크롤링해 오늘 날짜의 메뉴/칼로리 추출 (`src/domain/diet/repo/school-repo.ts`)
- 오늘 메뉴를 HTML 이메일로 포맷팅해 Gmail SMTP(`nodemailer`)로 발송 (`src/domain/diet/service/index.ts`의 `DietAlarmService`)
- GitHub Actions로 평일 매일 자동 실행 + `workflow_dispatch`로 수동 실행 지원 (`.github/workflows/daily-diet-alarm.yml`)
- 수신자 다중 지정(쉼표 구분), Gmail 앱 비밀번호 기반 인증

**🚧 설계만 되고 미연결 (스캐폴딩 단계)**
- `NotionDietRepository`(`src/domain/diet/repo/index.ts`) — 인터페이스만 있고 실제 Notion API 호출은 콘솔 로그만 찍고 빈 값/더미 ID 반환
- `src/app/page.tsx` 식단표 UI — Framer Motion으로 애니메이션까지 붙였지만 데이터는 `useEffect` 안 하드코딩된 샘플 배열(주석: "실제로는 notion을 통해 가져옴")
- `Providers` 공통 주입 계층(`src/providers/index.ts`) — `initialize()`가 로그만 찍는 빈 껍데기
- `src/domain/diet/ui/index.ts` — 실제 React 컴포넌트로 대체 예정인 콘솔 로그 스텁

즉 "학교 식단 이메일 알림"은 완성된 제품이고, "개인 식단 기록 웹앱"은 아키텍처와 UI 뼈대만 있고 Notion 연동은 아직 붙지 않은 상태.

## 아키텍처

`AGENTS.md`에 명시된 레이어드 도메인 구조를 그대로 따름:

```
Types -> Config -> Repo -> Service -> Runtime -> UI
```

- **Types** (`src/domain/diet/types`): `DietEntry`, `SchoolFoodMenu` 등 순수 타입, 외부 의존성 없음
- **Config** (`src/domain/diet/config`): Notion DB ID, 학교 급식 URL, 이메일 SMTP 설정 — 전부 `process.env` 기반
- **Repo** (`src/domain/diet/repo`): `SchoolFoodMenuRepository`(크롤링, 실동작) / `NotionDietRepository`(스텁)
- **Service** (`src/domain/diet/service`): `DietService`(칼로리 합산 등), `DietAlarmService`(오늘 메뉴 조회 → HTML 포맷 → 이메일 발송)
- **Runtime** (`src/domain/diet/runtime`): `alarm.ts`가 GitHub Actions에서 직접 실행되는 진입점(`tsx`로 실행), `index.ts`는 React 쪽에 서비스 싱글톤 노출
- **UI** (`src/app`, `src/domain/diet/ui`): Next.js App Router 페이지

의존 규칙은 왼쪽(하위 계층) 방향으로만 참조 가능 — ESLint `eslint-plugin-boundaries`로 기계적 강제.

## 기술 스택

| 영역 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 15 (App Router) | |
| 언어 | TypeScript, ESM(`"type": "module"`) | Node 24에서 `tsx`로 스크립트 직접 실행 |
| 크롤링 | axios + cheerio | 학교 홈페이지 HTML 파싱 |
| 이메일 | nodemailer (Gmail SMTP) | 앱 비밀번호 인증 필요 |
| 데이터 저장(설계) | Notion API (`@notionhq/client`) | 아직 미연결 |
| 스타일링 | TailwindCSS, Framer Motion, lucide-react | |
| 아키텍처 강제 | eslint-plugin-boundaries | 레이어 역참조 차단 |
| 스케줄링/배포 | GitHub Actions (cron + workflow_dispatch) | 서버 없이 무인 운영 |
| 테스트 | Playwright(`tests/ui`, 샘플만) | 유닛 테스트는 아직 없음(`npm test`는 더미) |

## 요구 사항 / 실행 방법

```bash
npm install --legacy-peer-deps   # CI/워크플로우와 동일하게 legacy-peer-deps 사용
npm run dev                      # 로컬 UI 개발 서버
npm run build && npm run lint    # 빌드 + 아키텍처 린트 검증
npx tsx src/domain/diet/runtime/alarm.ts   # 알림 이메일 수동 트리거(로컬)
```

필요 환경 변수(`.env`, 자세한 내용은 `docs/references/environment-setup.md`):

| 변수 | 설명 |
|---|---|
| `GMAIL_USER` | 발신용 Gmail 계정 |
| `GMAIL_APP_PASSWORD` | Gmail 앱 비밀번호(2단계 인증 필요) |
| `RECEIVER_EMAIL` | 수신자(쉼표로 다중 지정 가능) |
| `SMTP_HOST` / `SMTP_PORT` | 기본값 `smtp.gmail.com` / `465` |
| `NOTION_TOKEN` / `NOTION_DIET_DATABASE_ID` | Notion 연동용(현재 미사용) |

GitHub Actions 운영 시엔 `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `RECEIVER_EMAIL`을 리포지토리 Secrets로 등록.

## 개발 기록

커밋 타임스탬프 기준(날짜순):

- **2026-04-19 22:57** — 학교 식단 알림 시스템 최초 구현 (`feat: 학교 식단 알림 시스템 구현`)
- **2026-04-19 23:02~23:09** — GitHub Actions 설정 수정, 빈 메뉴일 때도 테스트용으로 메일 발송하도록 조정 후 다시 비활성화, 알람 시각을 07:45 KST로 조정
- **2026-04-21 00:28** — 학교 홈페이지 구조 변경으로 스크래퍼 깨짐 → 셀렉터 전면 수정, 환경설정 매뉴얼(`docs/references/environment-setup.md`) 추가
- **2026-04-21 00:55~01:00** — 미사용 샘플 도메인 정리, CI를 Node 24로 전환, tsconfig/ESLint 정합성 맞춰 CI 빌드 에러 해결
- **2026-04-21 01:18~01:34** — 그린 빌드 확보를 위한 연쇄 수정: 크롤링 파싱 보정, npm 의존성 충돌(`--legacy-peer-deps`) 해결, 린트 에러 전부 수정, CI용 더미 test 스크립트 추가, ESM + `tsx` 전환으로 Node 24 스크립트 실행 안정화
- **2026-04-21 13:56** — 알림 스케줄을 UTC 21:45(=KST 06:45)로 최종 조정

## 스크린샷 / 데모

_(준비 중 — 실행 화면/이메일 수신 캡처 추가 예정)_

## 트러블슈팅 · 배운 점

**문제: 매일 아침 발송되던 식단 알림 메일이 갑자기 도착하지 않음**

- **원인**: 문경여중 급식 홈페이지의 HTML 구조가 변경됨. 기존 셀렉터(`table.calendar`, `em`, `ul`)가 더 이상 유효하지 않았고, 메뉴 데이터가 `ul > li` 구조에서 `p` 태그 내부 `<br>` 구분자 방식으로 바뀜.
- **해결**: 클래스 기반 셀렉터를 태그 기반으로 완화(`table`), 날짜는 `em` 또는 `.num` 둘 다 대응, 칼로리는 "Kcal" 텍스트를 포함하는 `p` 태그를 탐색, 메뉴는 `p` 태그 HTML을 `<br>` 기준으로 split해서 추출하도록 `school-repo.ts` 재작성. (`docs/exec-plans/completed/20260421_fix_diet_scraper.md`)
- **교훈**: 외부 학교 홈페이지에 100% 의존하는 크롤러는 학교 측 사이트 개편에 취약함. 크롤링 실패를 조용히 삼키지 않고 알림으로 노출하는 게 다음 과제로 남음(아래 향후 계획 참고).

**부수적으로 겪은 CI/빌드 이슈**: Node 24 전환 과정에서 npm 의존성 충돌(`--legacy-peer-deps`로 해결), CommonJS/ESM 혼용 문제(`tsx`로 스크립트 실행 통일), ESLint 9 마이그레이션에 따른 룰 정합성 문제 등을 연쇄적으로 수정 (커밋 `0e8fb80`, `4bce29a`, `ecc3e1f` 등).

## 향후 계획

- **크롤링 실패 알림**: 실행 계획서(`20260421_fix_diet_scraper.md`)에 명시된 대로, 홈페이지 구조가 다시 바뀌어 파싱이 실패할 경우 조용히 스킵하지 말고 별도 경고 알림을 보내는 기능 추가
- **Notion 연동 완성**: `NotionDietRepository`가 현재 콘솔 로그 + 더미 값만 반환하는 스텁 상태 — 실제 Notion API 호출로 교체
- **식단표 UI 실데이터 연결**: `src/app/page.tsx`가 하드코딩된 샘플 데이터를 쓰고 있음 — `dietService`를 통해 Notion에서 실제 데이터를 가져오도록 연결
- **테스트 보강**: `npm test`가 현재 더미 스크립트(`echo "No tests configured yet"`)뿐이고, Playwright 테스트도 샘플(`tests/ui/sample.spec.ts`) 하나뿐 — 스크래퍼/이메일 포맷팅에 대한 실제 테스트 필요
- **Providers 계층 구현**: `src/providers/index.ts`의 `initialize()`가 아직 빈 껍데기 — Auth/Telemetry 등 실제 공통 관심사 주입 필요
