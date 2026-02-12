import * as dotenv from 'dotenv';

dotenv.config();

import {globSync} from 'glob';
import * as fs from 'fs';
import {nanoid} from 'nanoid';
import { User } from '../models/coreModels/account.js';
import { UserPassword } from '../models/coreModels/password.js';
import { Setting } from '../models/coreModels/settings.js';
import connectDB from '../config/db.js';

connectDB().catch((err) => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});


async function setupApp() {
  try {
    // 1. 관리자 생성 로직 (기존 유지)
    const newAdminPassword = new UserPassword();
    const salt = nanoid();
    const passwordHash = newAdminPassword.generateHash(salt, 'admin123');

    const demoAdmin = {
      id: 'admin@admin.com',
      name: 'administrator',
      email: 'hctorkim@gmail.com', // User 스키마에 email이 있다면 유지
      lastIp: '0.0.0.0',
      createdAt: Date.now(),
      enabled: true,
      role: 'admin',
      tempCode: null,        
      tempCodeCreatedAt: null
    };
    const result = await new User(demoAdmin).save();

    const AdminPasswordData = {
      password: passwordHash,
      emailVerified: true,
      salt: salt,
      user: result._id,
    };
    await new UserPassword(AdminPasswordData).save();
    console.log('👍 Admin created : Done!');

    // 2. 설정 파일 로드 로직 (기존 유지)
    const settingFiles = [];
    const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');

    for (const filePath of settingsFiles) {
      const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      settingFiles.push(...file);
    }

    // 🚀 [추가 지점] 이메일 발신용 설정을 배열에 직접 추가
    settingFiles.push(
      {
        settingCategory: 'email', // emailService와 일치시킴
        settingKey: 'email_user',  // 이 이름이 정확해야 함
        settingValue: process.env.EMAIL_USER, // 실제 구글 계정
        valueType: 'string',
        enabled: true,
      },
      {
        settingCategory: 'email',
        settingKey: 'email_pass',  // 이 이름이 정확해야 함
        settingValue: process.env.EMAIL_PASS, // 구글 앱 비밀번호 (16자리)
        valueType: 'string',
        enabled: true,
      },
      {
        settingCategory: 'email',
        settingKey: 'email_host',
        settingValue: 'smtp.gmail.com',
        valueType: 'string',
        enabled: true,
  }
    );

    // 3. DB에 모든 설정 저장
    await Setting.insertMany(settingFiles);
    console.log('👍 Email Settings created!');

    console.log('👍 Settings created : Done!');
    console.log('🥳 Setup completed : Success!');
    process.exit();
  } catch (e) {
    console.log('\n🚫 Error! The Error info is below');
    console.log(e);
    process.exit();
  }
}

setupApp();