import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import coreAuthRouter from './routes/coreRoutes/coreAuth.js';
import coreApiRouter from './routes/coreRoutes/coreApi.js';
// import coreDownloadRouter from './src/routes/coreRoutes/coreDownloadRouter.js';
// import corePublicRouter from './src/routes/coreRoutes/corePublicRouter.js';
// import adminAuth from './src/controllers/coreControllers/adminAuth.js';

const app: Application = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 1. 미들웨어 설정
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

app.use(compression());

// [디버깅용 로그] 서버가 시작될 때 라우터가 등록되는지 확인
console.log('✅ 라우터 설정 시작...');

app.use((req, res, next) => {
  console.log(`요청 발생: ${req.method} ${req.url}`);
  next();
});

// 1. 인증이 필요 없는 공개 라우트 (로그인, 회원가입 등)
app.use('/api', coreAuthRouter);
// app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);

// 아래 라우터들은 인증이 필요한 것들이므로 로그인 라우터보다 아래에 둡니다.
// app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);

export default app;