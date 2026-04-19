import 'dotenv/config';
import { SchoolFoodMenuRepository } from '../repo/school-repo';
import { EmailProvider } from '../../../providers/email';
import { DietAlarmService } from '../service';

async function runAlarm() {
  console.log('--- Starting Daily Diet Alarm ---');
  
  try {
    const schoolRepo = new SchoolFoodMenuRepository();
    const emailProvider = new EmailProvider();
    const alarmService = new DietAlarmService(schoolRepo, emailProvider);

    await alarmService.sendTodayDietAlarm();
    
    console.log('--- Alarm Job Completed Successfully ---');
  } catch (error) {
    console.error('--- Alarm Job Failed ---');
    console.error(error);
    process.exit(1);
  }
}

// 실행
runAlarm();
