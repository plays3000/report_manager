import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { Setting } from '../models/coreModels/settings.js';

const getTransporter = async () => {
  // 1. 카테고리가 'email'인 모든 활성화된 설정 가져오기
  const settings = await Setting.find({
    settingCategory: 'email',
    enabled: true
  });

  const emailConfig: Record<string, any> = {};
  settings.forEach(s => {
    // DB의 settingKey를 키로, settingValue를 값으로 매핑
    emailConfig[s.settingKey.trim()] = s.settingValue;
  });

  console.log('로드된 설정 키 목록:', Object.keys(emailConfig)); // 디버깅용

  // 2. 정확한 키 이름으로 존재하는지 확인
  if (!emailConfig.email_user || !emailConfig.email_pass) {
    throw new Error(`DB 설정 누락 -> email_user: ${!!emailConfig.email_user}, email_pass: ${!!emailConfig.email_pass}`);
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailConfig.email_user,
      pass: emailConfig.email_pass,
    },
  });
};

export const sendVerificationEmail = async (to: string, code: string) => {
  try {
    const currentTransporter = await getTransporter();
    
    // Transporter 옵션에서 발신자 주소 추출
    const options = currentTransporter.options as SMTPTransport.Options;
    const senderEmail = options.auth?.user;

    const mailOptions = {
      from: `"ERP System Admin" <${senderEmail}>`,
      to: to,
      subject: '[ERP 시스템] 관리자 2차 인증 번호',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2c3e50;">관리자 2차 인증</h2>
          <p>아래의 인증 번호를 입력하여 로그인을 완료해 주세요.</p>
          <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 24px;">
            <strong style="color: #4A90E2; letter-spacing: 5px;">${code}</strong>
          </div>
          <p style="font-size: 12px; color: #888; margin-top: 20px;">본 메일은 시스템에 의해 자동 발송되었습니다.</p>
        </div>
      `,
    };

    await currentTransporter.sendMail(mailOptions);
    console.log(`✅ 인증 이메일 발송 성공: ${to}`);
  } catch (error: any) {
    console.error('❌ 이메일 발송 실패:', error.message);
    throw error;
  }
};
