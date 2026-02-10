import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet'; // 1. 주석 해제 (설치 필요: npm install helmet)
import { config } from './config/app.js';
import authRoutes from './routes/authRoutes.js';
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
app.use('/api/core', coreRoutes);

// --- 3. 에러 핸들링 (반드시 라우트 뒤에 위치) ---

// 404 처리: 위 라우트들에 걸리지 않은 모든 요청
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// 500 전역 에러 처리: 모든 catch된 에러가 모이는 곳
app.use(errorHandlers);

export default app;

// import express, { Application, Request, Response } from 'express';
// import cors from 'cors';
// import compression from 'compression';
// import cookieParser from 'cookie-parser';

// import coreAuthRouter from './routes/coreRoutes/coreAuth.js';
// import coreApiRouter from './routes/coreRoutes/coreApi.js';
// // import coreDownloadRouter from './src/routes/coreRoutes/coreDownloadRouter.js';
// // import corePublicRouter from './src/routes/coreRoutes/corePublicRouter.js';
// // import adminAuth from './src/controllers/coreControllers/adminAuth.js';

// const app: Application = express();

// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));

// // 1. 미들웨어 설정
// app.use(cors({ origin: true, credentials: true }));
// app.use(cookieParser());

// app.use(compression());

// // [디버깅용 로그] 서버가 시작될 때 라우터가 등록되는지 확인
// console.log('✅ 라우터 설정 시작...');

// app.use((req, res, next) => {
//   console.log(`요청 발생: ${req.method} ${req.url}`);
//   next();
// });

// // 1. 인증이 필요 없는 공개 라우트 (로그인, 회원가입 등)
// app.use('/api', coreAuthRouter);
// // app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);

// // 아래 라우터들은 인증이 필요한 것들이므로 로그인 라우터보다 아래에 둡니다.
// // app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);

// export default app;