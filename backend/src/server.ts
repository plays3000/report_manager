import 'dotenv/config'; 
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