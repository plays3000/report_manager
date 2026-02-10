import 'dotenv/config'; // 최상단에서 한 번만 호출하면 충분합니다.
import app from './app.js';
import { config } from './config/app.js';
import connectDB from './config/db.js';

// 1. 데이터베이스 연결
// 비동기 에러 처리를 위해 .catch()를 붙여주는 것이 안전합니다.
connectDB().catch((err) => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});

// 2. 서버 실행
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
  ################################################
  🚀  Server listening on port: ${PORT}
  🏡  Frontend URL: ${config.corsOrigin}
  ################################################
  `);
});

// import 'dotenv/config';
// import { config } from './config/app.js';
// import express from 'express';
// import type { Application, Request, Response } from 'express';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import 'dotenv/config';
// // import multer from 'multer'; // multer 임포트 확인
// // import fs from 'fs'; // fs 임포트 확인
// import app from './app.js';
// import connectDB from './config/db.js'; // 확장자 .js 사용 (ESM 규칙)

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // DB 연결 실행
// connectDB().catch((err) => {
//   console.error('❌ Database connection failed:', err);
//   process.exit(1);
// });

// // const app: Application = express();

// // 미들웨어 설정
// app.use(cors());
// app.use(express.json()); // Body parser

// // 기본 루트 확인용
// app.get('/', (req: Request, res: Response) => {
//   res.send('ERP API Server is running...');
// });

// app.listen(config.port, () => {
//   console.log(`🚀 Server running on http://localhost:${config.port}`);
// });