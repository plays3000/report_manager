import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import { catchErrors } from '../handlers/errorHandlers.js';
import {getClientIp} from '../utils/ipHelper.js'; 

export const login = catchErrors(async (req: Request, res: Response) => {
  const { id, password } = req.body;
  const lastIp = getClientIp(req);
  console.log(lastIp)

  const result = await authService.loginUser(id, password, lastIp);

  // result에 user.role 정보가 포함되어 있다고 가정합니다.
  if (result.user.role === 'admin') {
    // 관리자라면 토큰을 주지 않고 "2차 인증 필요" 상태와 id만 반환
    return res.status(200).json({
      success: true,
      requires2FA: true,
      adminId: id,
      message: '관리자 인증이 필요합니다. 이메일을 확인하세요.'
    });
  } else {
  res.status(200).json({
      success: true,
      requires2FA: false,
      token: result.token,
      user: result.user,
      message: '로그인 성공'
    });
  }
});


export const register = catchErrors(async (req: Request, res: Response) => {
  const { id, name, password, role} = req.body;
  // const { id, name, password, role, lastIp } = req.body;
  // const lastIp  : string = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
  const lastIp = getClientIp(req);

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

export const verifySecondFactor = catchErrors(async (req: Request, res: Response) => {
  const { id, code } = req.body;
  console.log(id, code);

  if (!id || !code) {
    return res.status(400).json({
      success: false,
      message: '아이디와 인증 코드를 입력해주세요.',
    });
  }

  // 서비스 레이어에서 검증 로직 수행 (아래 Step 3 참고)
  const result = await authService.verifyAdminCodeAndGenerateToken(id, code);
  console.log(result);
  res.status(200).json({
    success: true,
    result,
    message: '인증에 성공했습니다. 대시보드로 이동합니다.',
  });
});

export const kakaoLoginOrRegister = catchErrors(async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: '인가 코드가 없습니다.',
    });
  }

  // 로직을 서비스 레이어로 위임합니다.
  // 백엔드에서 필요한 REST_API_KEY와 REDIRECT_URI는 서비스 내부나 config에서 관리하는 것이 좋습니다.
  const result = await authService.processKakaoLogin(code);

  res.status(200).json({
    success: true,
    result: {
      token: result.token,
      user: result.user
    },
    message: result.isNewUser ? '카카오 회원가입 및 로그인 성공' : '카카오 로그인 성공'
  });
});