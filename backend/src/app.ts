import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet'; // 1. 주석 해제 (설치 필요: npm install helmet)
import { config } from './config/app.js';
import authRoutes from './routes/coreRoutes/coreAuth.js';
import coreRoutes from './routes/coreRoutes/coreApi.js';
import errorHandlers from './handlers/errorHandlers.js';

const app: Application = express();

// --- 1. 보안 및 기본 미들웨어 설정 ---
app.use(helmet()); // 보안 헤더 설정
app.use(cors({
  origin: config.corsOrigin, // http://localhost:3000
  credentials: true
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- 2. 라우트 등록 (순서가 중요합니다) ---

// 기본 상태 체크 루트
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'ERP API Server is running...',
    env: config.nodeEnv
  });
});

// API 전용 라우트
app.use('/api/auth', authRoutes);
app.use('/api/core', coreRoutes);   // for login or register

// --- 3. 에러 핸들링 (반드시 라우트 뒤에 위치) ---

// 404 처리: 위 라우트들에 걸리지 않은 모든 요청
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// 500 전역 에러 처리: 모든 catch된 에러가 모이는 곳
app.use(errorHandlers);

export default app;
