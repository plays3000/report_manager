import { User } from '../models/coreModels/account.js';
import { UserPassword } from '../models/coreModels/password.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/app.js';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

export const loginUser = async (loginId: string, passwordIn: string, lastIp: string) => {
  // 1. User 모델에서 아이디(id 필드)로 사용자 검색
  const user = await User.findOne({ id: loginId, enable: true });
  
  if (!user) {
    throw new Error('존재하지 않거나 비활성화된 계정입니다.');
  }
  if (user.lastIp && user.lastIp !== lastIp) {
    console.log(`IP 불일치: DB(${user.lastIp}) vs 접속(${lastIp})`);
    throw new Error('등록되지 않은 기기(IP)에서의 접속입니다. 관리자에게 문의하세요.');
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

export const registerUser = async (userData: { id: string; name: string; password: string; lastIp: string; role?: string }) => {
  const { id, name, password, lastIp,role } = userData;

  // 1. 중복 사용자 체크
  const userExists = await User.findOne({ id });
  if (userExists) {
    throw new Error('이미 존재하는 계정입니다.');
  }

  // 2. User(Account) 생성
  const newUser = await new User({
    id,
    name,
    lastIp:lastIp,
    role: role || 'user',
    enable: true,
  }).save();

  // 3. 비밀번호 해싱 및 저장
  const userPassword = new UserPassword();
  const salt = nanoid();
  const passwordHash = userPassword.generateHash(salt, password);

  //4. save the password in mongodb
  await new UserPassword({
    user: newUser._id,
    password: passwordHash,
    salt: salt,
  }).save();

  return {
    id: newUser.id,
    name: newUser.name,
    lastIp: lastIp
  };
};