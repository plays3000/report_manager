================================================
FILE: backend/readme.md
================================================
backend/
├── src/
│   ├── config/         # DB 연결, 환경 변수 설정 (기존 유지)
│   ├── constants/      # HTTP 상태 코드, 에러 메시지 등 고정값
│   ├── controllers/    # 요청을 받고 응답을 보내는 얇은 계층
│   ├── handlers/       # 전역 에러 핸들러 (기존 유지)
│   ├── middlewares/    # 인증(Auth), 유효성 검사(Joi), 업로드
│   ├── models/         # Mongoose 스키마 (coreModels 통합)
│   ├── routes/         # 엔드포인트 정의
│   ├── services/       # 비즈니스 로직 (핵심 리팩토링 대상)
│   ├── types/          # TypeScript 인터페이스/타입 정의
│   ├── utils/          # 공통 함수 (해싱, 날짜 포맷 등)
│   ├── app.ts          # Express 앱 설정
│   └── server.ts       # 서버 실행부 (EntryPoint)
├── .env
├── tsconfig.json
└── package.json
