import { User } from '../models/coreModels/account.js';
import { UserPassword } from '../models/coreModels/password.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/app.js';
import mongoose from 'mongoose';

export const loginUser = async (loginId: string, passwordIn: string) => {
  // 1. User 모델에서 아이디(id 필드)로 사용자 검색
  const user = await User.findOne({ id: loginId, enable: true });
  
  if (!user) {
    throw new Error('존재하지 않거나 비활성화된 계정입니다.');
  }

  // 2. UserPassword 모델에서 user 필드(ObjectId)로 패스워드 정보 검색
  const userPwd = await UserPassword.findOne({ 
    user: user._id as mongoose.Types.ObjectId, 
    removed: false 
  });

  if (!userPwd) {
    throw new Error('인증 정보를 찾을 수 없습니다.');
  }

  // 3. 모델에 정의된 validPassword 메소드를 사용하여 비밀번호 검증
  // 스키마에 정의된 salt와 입력받은 passwordIn을 결합하여 비교합니다.
  const isMatch = userPwd.validPassword(userPwd.salt, passwordIn);

  if (!isMatch) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  // 4. JWT 토큰 생성
  const token = jwt.sign(
    { 
      userId: user._id, 
      role: user.role 
    },
    config.jwtSecret,
    { expiresIn: '24h' }
  );

  // 5. 성공 데이터 반환 (민감한 정보인 password, salt 등은 제외)
  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    token,
  };
};