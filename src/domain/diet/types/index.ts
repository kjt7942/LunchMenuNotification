// src/domain/diet/types/index.ts
// 식단 데이터 타입 정의

export type MealType = '아침' | '점심' | '저녁' | '간식';

export interface DietEntry {
  id: string;
  date: string;
  type: MealType;
  menu: string;
  description?: string;
  completed: boolean;
  calories?: number;
}

export interface DietSummary {
  totalCalories: number;
  count: number;
}

// 학교 식단 정보 타입
export interface SchoolFoodMenu {
  date: string;         // 날짜 (YYYY.MM.DD)
  dayOfWeek: string;    // 요일
  menuItems: string[];  // 식단 메뉴 리스트
  calories: string;     // 칼로리 정보
  allergies?: string[]; // 알레르기 정보
}
