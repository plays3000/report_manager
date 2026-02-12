import { User } from '../models/coreModels/account.js';
import { UserPassword } from '../models/coreModels/password.js';
import { sendVerificationEmail } from './emailService.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/app.js';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import axios from 'axios';
import bcrypt from 'bcryptjs';

export const loginUser = async (loginId: string, passwordIn: string, lastIp: string) => {
  // 1. User 모델에서 아이디로 사용자 검색
  const user = await User.findOne({ id: loginId, enable: true });
  
  if (!user) {
    throw new Error('존재하지 않거나 비활성화된 계정입니다.');
  }

  // 2. UserPassword 모델에서 패스워드 정보 검색
  const userPwd = await UserPassword.findOne({ 
    user: user._id as mongoose.Types.ObjectId, 
    removed: false 
  });

  if (!userPwd) {
    throw new Error('인증 정보를 찾을 수 없습니다.');
  }

  // 3. 비밀번호 검증 (모든 계정 공통)
  const isMatch = userPwd.validPassword(userPwd.salt, passwordIn); 
  if (!isMatch) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  // 🚨 [추가된 로직] 관리자 계정 분기 처리
  // 비밀번호가 일치하는 경우, IP를 대조하기 전에 관리자인지 먼저 확인합니다.
  if (user.role === 'admin' || user.role === 'owner') {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ 핵심: 생성한 코드를 해당 유저 문서에 저장 (유효시간 5분 설정을 권장)
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          tempCode: verificationCode,
          tempCodeCreatedAt: new Date() // 필요 시 만료 체크용
        } 
      }
    );

    // 4. [중요] 여기서 작성하신 메소드를 사용합니다!
    // 수신자(to)는 user.id (이메일 형태인 경우) 혹은 user.email을 넣습니다.
    await sendVerificationEmail(user.id, verificationCode);

    // 관리자는 IP 대조를 하지 않고 바로 2차 인증 응답을 반환합니다.
    return {
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      requires2FA: true,
      adminId: user.id,
      message: '관리자 계정은 2차 인증이 필요합니다.',
      debugCode: verificationCode
    };
  }

  // --- 기존 사용자 IP 대조 로직 (관리자가 아닐 경우에만 실행됨) ---
  if (user.lastIp && user.lastIp !== lastIp) {
    console.log(`IP 불일치: DB(${user.lastIp}) vs 접속(${lastIp})`);
    throw new Error('등록되지 않은 기기(IP)에서의 접속입니다. 관리자에게 문의하세요.');
  }

  // 4. 일반 사용자용 JWT 토큰 생성
  const token = jwt.sign(
    { 
      userId: user._id, 
      role: user.role 
    },
    config.jwtSecret,
    { expiresIn: '24h' }
  );

  // 5. 성공 데이터 반환
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

export const verifyAdminCodeAndGenerateToken = async (userId: string, inputCode: string) => {
  // 1. 유저 확인
  const user = await User.findOne({ id: userId }).lean();;

  if (!user) {
    throw new Error(`사용자(${userId})를 찾을 수 없습니다.`);
  }

  const savedCode = user.tempCode;
  const isCodeValid = (inputCode === savedCode); // 실제로는 저장된 코드와 대조하세요.
  
  if (!isCodeValid) {
    throw new Error(`인증 코드가 일치하지 않거나 만료되었습니다. real code : ${savedCode}, input code: ${inputCode}`);
  }

  // ✅ 인증 성공 후 코드 초기화 (1회용 보안)
  await User.updateOne({ _id: user._id }, { $unset: { tempCode: "", tempCodeCreatedAt: "" } });

  // 3. 2차 인증이 완료된 최종 토큰 발급 (권한 레벨 상향 등)
  const finalToken = jwt.sign(
    { 
      userId: user._id, 
      role: user.role,
      verified: true // 2차 인증 완료 표시
    },
    config.jwtSecret,
    { expiresIn: '12h' }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    token: finalToken,
  };
};

export const processKakaoLogin = async (code: string) => {
  try {
    // 1. 카카오 토큰 요청
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.REST_API,
        redirect_uri: process.env.REDIRECT_URI,
        code,
      },
    });
    
    const { access_token } = tokenResponse.data;

    // 2. 유저 정보 요청
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { kakao_account, properties, id: kakaoId } = userResponse.data;
    
    // 🚨 포인트 1: 이메일이 없는 경우 대비 (카카오 설정을 안 했을 때 undefined 방지)
    const email = kakao_account?.email || `kakao_${kakaoId}@kakao.com`;
    const nickname = properties?.nickname || '카카오 사용자';

    // 3. DB 확인
    let user = await User.findOne({ id: email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      
      // 🚨 포인트 2: Mongoose 트랜잭션 대신 순차 생성 (ID 중복 체크)
      user = new User({
        id: email,
        email: email,
        name: nickname,
        // provider: 'kakao', // 주의: 스키마에 provider 필드가 실제 존재하는지 확인 필수!
        role: 'user'
      });
      await user.save();

      const salt = bcrypt.genSaltSync(10);
      const dummyPassword = `social_${nanoid(10)}`; // nanoid 활용
      const hashedPassword = bcrypt.hashSync(dummyPassword, 10);

      await UserPassword.create({
        user: user._id,
        password: hashedPassword,
        salt: salt,
        authType: 'kakao'
      });
    }

    // 🚨 포인트 3: 환경변수 체크 및 JWT 생성
    if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET이 .env에 설정되지 않았습니다.");
        throw new Error("서버 내부 설정 오류");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    return { token, user: { name: user.name, role: user.role }, isNewUser };

  } catch (error: any) {
    // 백엔드 터미널에서 에러의 '진짜' 원인을 출력합니다.
    console.error("❌ Kakao Login Error 상세 로그:");
    console.log('REST_API_KEY:', process.env.REST_API);
    console.log('REDIRECT_URI:', process.env.REDIRECT_URI);
    if (error.response) {
      // 카카오 API 응답 에러 (키값 불일치, 이미 사용된 코드 등)
      console.error(error.response.data);
    } else {
      // DB 에러, 문법 에러 등
      console.error(error.message);
    }
    throw error; // 다시 던져서 컨트롤러에서 처리하게 함
  }
};