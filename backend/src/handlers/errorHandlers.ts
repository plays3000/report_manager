import { Request, Response, NextFunction } from 'express';

/**
 * 전역 에러 처리 미들웨어
 */
const errorHandlers = (err: any, req: Request, res: Response, next: NextFunction) => {
  // 1. 기본 에러 설정
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 2. 개발 환경과 운영 환경에 따른 응답 차별화
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack, // 개발 중에는 에러가 발생한 위치 확인을 위해 스택 포함
    });
  }

  // 3. 운영 환경에서의 에러 응답
  // 사용자에게 불필요한 서버 내부 정보를 노출하지 않습니다.
  let error = { ...err };
  error.message = err.message;

  // Mongoose의 잘못된 ID 형식 에러 처리 (CastError)
  if (err.name === 'CastError') {
    error.message = `잘못된 경로입니다: ${err.path}: ${err.value}`;
    err.statusCode = 400;
  }

  // Mongoose 중복 필드 에러 처리 (Duplicate Key)
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    error.message = `중복된 필드 값: ${value}. 다른 값을 사용해 주세요.`;
    err.statusCode = 400;
  }

  // Mongoose 유효성 검사 에러 처리 (ValidationError)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((el: any) => el.message);
    error.message = `입력값이 올바르지 않습니다. ${messages.join('. ')}`;
    err.statusCode = 400;
  }

  // JWT 관련 에러 처리
  if (err.name === 'JsonWebTokenError') {
    error.message = '유효하지 않은 토큰입니다. 다시 로그인해 주세요.';
    err.statusCode = 401;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: error.message || '서버 내부 오류가 발생했습니다.',
  });
};

export default errorHandlers;

export const catchErrors = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};