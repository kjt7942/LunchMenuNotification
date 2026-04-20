# 환경 설정 및 이메일 수신자 관리 가이드

이 문서는 본 시스템의 동작을 위해 필요한 환경 변수를 설정하고, 알림을 받을 수신자 이메일을 관리하는 방법을 설명합니다.

## 1. 📧 이메일 수신자(RECEIVER_EMAIL) 추가 방법

현재 시스템은 GitHub Actions를 통해 매일 아침 자동으로 이메일을 발송하고 있습니다. 수신자를 추가하거나 변경하려면 다음 단계를 따르세요.

### GitHub Secrets에서 수정 (실제 운영 환경)
1. GitHub 리포지토리 페이지로 이동합니다.
2. 상단 탭에서 **Settings**를 클릭합니다.
3. 왼쪽 사이드바에서 **Secrets and variables** > **Actions**를 선택합니다.
4. **Repository secrets** 섹션에서 `RECEIVER_EMAIL` 항목을 찾습니다.
5. `Edit` 버튼(연필 아이콘)을 클릭합니다.
6. **Value** 칸에 이메일 주소를 입력합니다.
    - **단일 수신자**: `user1@example.com`
    - **다중 수신자**: 각 이메일을 **쉼표(,)**로 구분하여 입력합니다. (예: `user1@example.com, user2@example.com`)
7. **Update secret** 버튼을 눌러 저장합니다.

### 로컬 환경(.env)에서 수정 (개발/테스트 환경)
1. 프로젝트 루트 디렉토리에 있는 `.env` 파일을 엽니다.
2. `RECEIVER_EMAIL` 항목의 값을 수정합니다.
   ```env
   RECEIVER_EMAIL=user1@example.com, user2@example.com
   ```

---

## 2. 🔑 주요 환경 변수 상세 설명

| 변수명 | 설명 | 비고 |
| :--- | :--- | :--- |
| `GMAIL_USER` | 이메일을 발송할 Gmail 계정 주소 | Gmail 보안 설정 필요 |
| `GMAIL_APP_PASSWORD` | Gmail 앱 비밀번호 (2단계 인증 필요) | 일반 비밀번호 사용 불가 |
| `RECEIVER_EMAIL` | 식단 알림을 받을 수신 주소 | 여러 명일 경우 쉼표(,)로 구분 |
| `SMTP_HOST` | 메일 서버 호스트 (기본: `smtp.gmail.com`) | |
| `SMTP_PORT` | 메일 서버 포트 (기본: `465`) | |

## 3. ⚠️ 주의 사항
- **Gmail 앱 비밀번호**: 발송용 계정의 Gmail 설정에서 '앱 비밀번호'를 생성해서 사용해야 하며, 일반 로그인 비밀번호를 넣으면 발송이 실패합니다.
- **오타 주의**: 쉼표 뒤에 공백이 있어도 시스템에서 처리하지만, 가급적 `email1@test.com,email2@test.com` 형태로 붙여 쓰는 것이 권장됩니다.
- **GitHub Actions 반영**: Secret을 수정한 후, 다음 스케줄링 시점부터 변경된 이메일로 발송됩니다. 즉시 확인하려면 Actions 탭에서 `Daily Diet Alarm` 워크플로우를 수동 실행(`Run workflow`)해 보세요.
