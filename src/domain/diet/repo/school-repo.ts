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
      $('table tbody td').each((_, td) => {
        // 날짜 추출 (em 태그 또는 span.num)
        const dayText = $(td).find('em, .num').first().text().trim();
        if (!dayText) return;

        // 칼로리 추출 (p 태그 중 Kcal 포함)
        let calories = '';
        $(td).find('p').each((_, p) => {
          const text = $(p).text().trim();
          if (text.includes('Kcal')) {
            calories = text;
          }
        });

        // 메뉴 추출 (br 태그로 구분된 텍스트 또는 ul li)
        const menuItems: string[] = [];
        const menuContainer = $(td).find('p, ul').last();
        
        if (menuContainer.prop('tagName') === 'UL') {
          menuContainer.find('li').each((_, li) => {
            menuItems.push($(li).text().trim());
          });
        } else {
          const html = menuContainer.html() || '';
          const lines = html.split(/<br\s*\/?>/i);
          lines.forEach(line => {
            const cleanLine = cheerio.load(line).text().trim();
            if (cleanLine && !cleanLine.includes('Kcal') && !cleanLine.includes('상세보기')) {
              menuItems.push(cleanLine);
            }
          });
        }

        if (menuItems.length === 0) return;

        const dayFormatted = dayText.padStart(2, '0');
        const year = yearMonth.substring(0, 4);
        const month = yearMonth.substring(4, 6);

        menus.push({
          date: `${year}.${month}.${dayFormatted}`,
          dayOfWeek: '',
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
