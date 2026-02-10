import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
// import multer from 'multer'; // multer 임포트 확인
// import fs from 'fs'; // fs 임포트 확인
import app from './app.js';
import connectDB from './config/db.js'; // 확장자 .js 사용 (ESM 규칙)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB 연결 실행
connectDB();

// const app: Application = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // Body parser

// 기본 루트 확인용
app.get('/', (req: Request, res: Response) => {
  res.send('ERP API Server is running...');
});

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});