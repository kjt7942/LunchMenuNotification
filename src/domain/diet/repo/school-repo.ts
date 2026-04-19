import axios from 'axios';
import * as cheerio from 'cheerio';
import { SchoolFoodMenu } from '../types';
import { DIET_CONFIG } from '../config';

export class SchoolFoodMenuRepository {
  /**
   * 지정된 월의 전체 식단을 가져옵니다.
   * @param yearMonth YYYYMM 형식
   */
  async getMonthlyMenu(yearMonth: string): Promise<SchoolFoodMenu[]> {
    try {
      const url = `${DIET_CONFIG.SCHOOL_URL}&yearMonth=${yearMonth}`;
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const menus: SchoolFoodMenu[] = [];

      // 달력의 각 날짜(td)를 순회하며 데이터 추출
      $('table.calendar tbody td').each((_, td) => {
        const dayText = $(td).find('em').text().trim();
        if (!dayText) return;

        const menuText = $(td).find('ul').text().trim();
        if (!menuText) return;

        // 메뉴, 칼로리 등을 구분 (사이트 구조에 따라 정교화 필요)
        const lines = menuText.split('\n').map(l => l.trim()).filter(l => l !== '');
        
        let calories = '';
        const menuItems: string[] = [];

        lines.forEach(line => {
          if (line.includes('kcal')) {
            calories = line;
          } else if (line.match(/^\d/)) {
            // 숫자로 시작하는 알레르기 정보 등은 제외하거나 처리
          } else {
            menuItems.push(line);
          }
        });

        const dayFormatted = dayText.padStart(2, '0');
        const year = yearMonth.substring(0, 4);
        const month = yearMonth.substring(4, 6);

        menus.push({
          date: `${year}.${month}.${dayFormatted}`,
          dayOfWeek: '', // 서버 데이터에 요일 정보가 명시적이지 않을 수 있음
          menuItems,
          calories,
        });
      });

      return menus;
    } catch (error) {
      console.error('Failed to fetch school menu:', error);
      return [];
    }
  }

  /**
   * 오늘 날짜의 식단을 가져옵니다.
   */
  async getTodayMenu(): Promise<SchoolFoodMenu | null> {
    const now = new Date();
    // 한국 시간 기준 (UTC+9)
    const krNow = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const year = krNow.getFullYear();
    const month = String(krNow.getMonth() + 1).padStart(2, '0');
    const day = String(krNow.getDate()).padStart(2, '0');
    
    const yearMonth = `${year}${month}`;
    const todayStr = `${year}.${month}.${day}`;

    const monthlyMenu = await this.getMonthlyMenu(yearMonth);
    return monthlyMenu.find(m => m.date === todayStr) || null;
  }
}
