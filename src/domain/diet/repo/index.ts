// src/domain/diet/repo/index.ts
// 식단 데이터 저장소 인터페이스 및 구현

import { DietEntry } from '../types';

export interface DietRepository {
  getDiets(startDate: string, endDate: string): Promise<DietEntry[]>;
  addDiet(diet: Omit<DietEntry, 'id'>): Promise<string>;
  updateDiet(id: string, updates: Partial<DietEntry>): Promise<void>;
  deleteDiet(id: string): Promise<void>;
}

export class NotionDietRepository implements DietRepository {
  async getDiets(startDate: string, endDate: string): Promise<DietEntry[]> {
    // 실제 구현 시 Notion API 호출
    console.log(`Fetching diets from ${startDate} to ${endDate}`);
    return [];
  }

  async addDiet(diet: Omit<DietEntry, 'id'>): Promise<string> {
    console.log(`Adding new diet: ${diet.menu}`);
    return 'new-id';
  }

  async updateDiet(id: string, _updates: Partial<DietEntry>): Promise<void> {
    console.log(`Updating diet ${id}`);
  }

  async deleteDiet(id: string): Promise<void> {
    console.log(`Deleting diet ${id}`);
  }
}
