// import type { Request, Response } from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { User } from '../models/coreModels/account.js';
// import { UserPassword } from '../models/coreModels/password.js';
// import { nanoid } from 'nanoid';

// export const register = async (req: Request, res: Response) => {
//   try {
//     const { id, name, password, role } = req.body; // password를 받아야 합니다.

//     const userExists = await User.findOne({ id });
//     if (userExists) {
//       return res.status(400).json({ message: '이미 존재하는 계정입니다.' });
//     }

//     const clientIp = req.ip || req.socket.remoteAddress || '';

//     // 1. User(Account) 생성
//     const user = await User.create({
//       id,
//       name,
//       lastIp: clientIp,
//       role: role || 'user'
//     });

//     // 2. Password 생성 (IDURAR 방식: salt + 해싱)
//     const salt = nanoid();
//     const userPassword = new UserPassword();
//     const passwordHash = userPassword.generateHash(salt, password);

//     await UserPassword.create({
//       user: user._id as any, 
//       password: passwordHash,
//       salt: salt,
//       removed: false // 스키마에서 required이므로 명시
//     });

//     res.status(201).json({
//       success: true,
//       message: '사용자 등록 성공',
//       user: { id: user.id, name: user.name }
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { id, password } = req.body;
//     const clientIp = req.ip || req.socket.remoteAddress || '';

//     // 1. 유저 확인 (변수명을 user로 통일)
//     const user = await User.findOne({ id });
//     if (!user) return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });

//     // 2. 비밀번호 확인
//     // user 필드에 user._id를 명시적으로 넣고, 필요시 .toString()으로 캐스팅합니다.
//     const authData = await UserPassword.findOne({ 
//       user: user._id as any // 또는 user._id.toString()
//     });

//     if (!authData || !authData.validPassword(authData.salt as string, password)) {
//       return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
//     }

//     // 3. IP 업데이트 및 토큰 발급
//     user.lastIp = clientIp;
//     await user.save();

//     const token = jwt.sign(
//       { id: user._id }, 
//       process.env.JWT_SECRET!, 
//       { expiresIn: '1d' }
//     );
    
//     return res.json({ 
//       success: true, 
//       token, 
//       user: { id: user.id, name: user.name } 
//     });
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message });
//   }
// };

import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import { catchErrors } from '../handlers/errorHandlers.js';

export const login = catchErrors(async (req: Request, res: Response) => {
  const { id, password } = req.body;
  
  // 여기서 에러가 발생(throw)하거나 서비스에서 에러가 나면 
  // 자동으로 전역 에러 핸들러로 이동합니다.
  const result = await authService.loginUser(id, password);

  res.status(200).json({
    success: true,
    result
  });
});