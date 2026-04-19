// src/domain/diet/service/index.ts
// 식단 비즈니스 로직

import { DietEntry, DietSummary } from '../types';
import { DietRepository } from '../repo';

export class DietService {
  constructor(private repo: DietRepository) {}

  async getDailyDiets(date: string): Promise<DietEntry[]> {
    return this.repo.getDiets(date, date);
  }

  async calculateSummary(diets: DietEntry[]): Promise<DietSummary> {
    const totalCalories = diets.reduce((acc, curr) => acc + (curr.calories || 0), 0);
    return {
      totalCalories,
      count: diets.length,
    };
  }

  async recordMeal(data: Omit<DietEntry, 'id' | 'completed'>): Promise<string> {
    return this.repo.addDiet({
      ...data,
      completed: true,
    });
  }
}

import { SchoolFoodMenuRepository } from '../repo/school-repo';
import { EmailProvider } from '../../../providers/email';
import { DIET_CONFIG } from '../config';

export class DietAlarmService {
  constructor(
    private schoolRepo: SchoolFoodMenuRepository,
    private emailProvider: EmailProvider
  ) {}

  async sendTodayDietAlarm(): Promise<void> {
    const todayMenu = await this.schoolRepo.getTodayMenu();

    if (!todayMenu) {
      console.log('No menu found for today.');
      return;
    }

    const receiver = DIET_CONFIG.EMAIL.RECEIVER;
    if (!receiver) {
      throw new Error('Receiver email is not configured.');
    }

    const htmlContent = this.formatMenuToHtml(todayMenu);

    await this.emailProvider.sendEmail({
      to: receiver,
      subject: `[식단알림] ${todayMenu.date} 문경여중 오늘의 메뉴입니다.`,
      html: htmlContent,
    });
  }

  private formatMenuToHtml(menu: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #4A90E2; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">🍴 오늘의 학교 식단</h2>
        <p style="font-size: 1.1em;"><strong>날짜:</strong> ${menu.date} (${menu.dayOfWeek || '오늘'})</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <ul style="list-style-type: none; padding: 0; font-size: 1.2em; line-height: 1.6;">
            ${menu.menuItems.map((item: string) => `<li style="margin-bottom: 8px;">• ${item}</li>`).join('')}
          </ul>
        </div>
        <p style="color: #666;"><strong>에너지:</strong> ${menu.calories}</p>
        <div style="margin-top: 30px; font-size: 0.8em; color: #999; text-align: center;">
          본 메일은 매일 아침 자동으로 발송되는 식단 알림입니다.
        </div>
      </div>
    `;
  }
}
