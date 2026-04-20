// src/providers/index.ts
// 애플리케이션 공통 관심사 (Auth, Theme, Telemetry 등) 주입 계층



export const Providers = {
  // 여기에 공통 서비스 인스턴스 초기화 로직 구현
  initialize() {
    console.log('[Providers] Initializing core services...');
  }
};
