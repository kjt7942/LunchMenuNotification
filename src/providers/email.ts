import nodemailer from 'nodemailer';
import { DIET_CONFIG } from '../domain/diet/config';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: DIET_CONFIG.EMAIL.HOST,
      port: DIET_CONFIG.EMAIL.PORT,
      secure: DIET_CONFIG.EMAIL.PORT === 465, // 465는 상시 보안 연결(SSL)
      auth: {
        user: DIET_CONFIG.EMAIL.USER,
        pass: DIET_CONFIG.EMAIL.PASS,
      },
    });
  }

  /**
   * 이메일을 발송합니다.
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    if (!DIET_CONFIG.EMAIL.USER || !DIET_CONFIG.EMAIL.PASS) {
      throw new Error('Email credentials are not configured in environment variables.');
    }

    const mailOptions = {
      from: `"학교 식단 알리미" <${DIET_CONFIG.EMAIL.USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
