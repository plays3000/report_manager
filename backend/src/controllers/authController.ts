import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import { catchErrors } from '../handlers/errorHandlers.js';

export const login = catchErrors(async (req: Request, res: Response) => {
  const { id, password } = req.body;
  const lastIp  : string = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
  console.log(lastIp)
  
  // 여기서 에러가 발생(throw)하거나 서비스에서 에러가 나면 
  // 자동으로 전역 에러 핸들러로 이동합니다.
  const result = await authService.loginUser(id, password, lastIp);
  console.log(result);
  res.status(200).json({
    success: true,
    result
  });
});


export const register = catchErrors(async (req: Request, res: Response) => {
  const { id, name, password, role} = req.body;
  // const { id, name, password, role, lastIp } = req.body;
  const lastIp  : string = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';

  // 간단한 필수값 검증 (Joi 등을 쓰면 더 좋습니다)
  if (!id || !name || !password) {
    return res.status(400).json({
      success: false,
      message: '아이디, 이름, 비밀번호는 필수 입력 항목입니다.',
    });
  }

  const result = await authService.registerUser({ 
    id: id, 
    name: name, 
    password: password, 
    lastIp: lastIp, 
    role: role 
  });

  res.status(201).json({
    success: true,
    result,
    message: '사용자 등록이 완료되었습니다.',
  });
});