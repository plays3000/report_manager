import dotenv from 'dotenv';

// .env 파일의 환경 변수를 로드합니다.
dotenv.config();

export const config = {
  // 백엔드 서버 포트를 8888로 설정 (환경 변수가 없을 경우 대비)
  port: process.env.PORT || 8888,
  
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // 보안을 위해 JWT_SECRET은 반드시 .env에 정의하는 것이 좋습니다.
  jwtSecret: process.env.JWT_SECRET ? process.env.JWT_SECRET : 'your-default-secret',
  
  mongoUri: process.env.DATABASE,
  
  // 프론트엔드 서버 포트 3000에 맞춰 CORS 허용 도메인 설정
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};