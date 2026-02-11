================================================
FILE: backend/readme.md
================================================
backend/
├── src/
│   ├── config/          # DB 연결 및 환경 변수(env) 설정
│   ├── constants/       # HTTP 상태 코드, 에러 메시지 등 고정 상수 관리
│   ├── controllers/     # API 요청 수신 및 응답 반환 (Thin Controller)
│   ├── handlers/        # 전역 에러 핸들러 및 예외 처리 로직
│   ├── middlewares/     # 인증(Auth), 유효성 검사(Joi), 파일 업로드 등 공통 미들웨어
│   ├── models/          # Mongoose(MongoDB) 스키마 및 데이터 모델 정의
│   ├── routes/          # API 엔드포인트(URL) 경로 정의 및 라우팅
│   ├── services/        # 실제 비즈니스 로직 처리 및 DB 연동 (Core Logic)
│   ├── types/           # 공통 TypeScript Interface 및 Type 정의
│   ├── utils/           # 유틸리티 함수 (해싱, 날짜 포맷팅, 토큰 생성 등)
│   ├── app.ts           # Express 애플리케이션 초기 설정 및 미들웨어 연결
│   └── server.ts        # 서버 실행 및 포트 바인딩 (EntryPoint)
├── .env                 # 환경 변수 설정 파일 (보안 주의)
├── tsconfig.json        # TypeScript 컴파일 설정
└── package.json         # 의존성 패키지 및 스크립트 관리
