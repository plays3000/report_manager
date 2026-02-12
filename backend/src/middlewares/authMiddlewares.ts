import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/app.js';

interface AuthRequest extends Request {
  user?: any;
}

export const isValidToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1. 헤더에서 토큰 추출 (Bearer Token 방식)
    const authHeader = req.headers.authorization as string;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '인증 토큰이 없거나 형식이 올바르지 않습니다.'
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. 토큰 검증
    const decoded = jwt.verify(token!, config.jwtSecret);

    // 3. 요청 객체에 디코딩된 유저 정보 담기
    // 이를 통해 이후 컨트롤러에서 req.user.userId 로 접근 가능합니다.
    req.user = decoded;

    next(); // 다음 로직(컨트롤러)으로 이동
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: '토큰이 만료되었습니다.' });
    }
    return res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다.' });
  }
};