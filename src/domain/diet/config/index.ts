// src/domain/diet/config/index.ts
// 식단 도메인 설정

export const DIET_CONFIG = {
  NOTION_DATABASE_ID: process.env.NOTION_DIET_DATABASE_ID || '',
  DEFAULT_MEAL_TYPES: ['아침', '점심', '저녁', '간식'] as const,
  PAGINATION_SIZE: 50,
  // 학교 식단 관련 설정
  SCHOOL_URL: 'https://school.gyo6.net/mkgms/ad/fm/foodmenu/selectFoodMenuView.do?mi=153190',
  EMAIL: {
    HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    PORT: Number(process.env.SMTP_PORT) || 465,
    USER: process.env.GMAIL_USER,
    PASS: process.env.GMAIL_APP_PASSWORD,
    RECEIVER: process.env.RECEIVER_EMAIL,
  }
};
