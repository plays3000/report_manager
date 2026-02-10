import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from './app.js';

// 함수 외부에서 미리 로드
dotenv.config();

const connectDB = async (): Promise<void> => {
  const uri = config.mongoUri;

  if (!uri) {
    console.error('❌ Error: MONGO_URI가 .env 파일에 정의되지 않았습니다.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ DB Connection Error: ${error.message}`);
    }
    process.exit(1);
  }
};

export default connectDB;
