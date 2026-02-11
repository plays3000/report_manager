import { Schema, model, type Document, type Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. 메소드 정의를 위한 인터페이스
interface IPwdMethods {
  generateHash(salt: string, password: string): string;
  validPassword(salt: string, userpassword: string): boolean;
}


// 2. 전체 문서 인터페이스 (IPwdMethods 상속)
interface IPwd extends Document, IPwdMethods {
    removed: boolean;
    user: Types.ObjectId;
    password: string;
    salt: string;
    emailToken?: string;
    resetToken?: string;
    emailVerified: boolean;
    authType: string;
    loggedSessions: string[];
}

// 3. 스키마 정의 시 3번째 인자로 IPwdMethods를 전달
const passwordSchema = new Schema<IPwd, {}, IPwdMethods>({
    removed: { type: Boolean, default: false },
    user: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    authType: { type: String, default: 'id' },
    loggedSessions: { type: [String], default: [] }
});

// 메소드 구현
// passwordSchema.methods.generateHash = function (salt: string, password: string) {
//   return bcrypt.hashSync(salt + password, 10);
// };

// passwordSchema.methods.validPassword = function (salt: string, userpassword: string) {
//   return bcrypt.compareSync(salt + userpassword, this.password);
// };

passwordSchema.methods.generateHash = function(salt: string, password: string) {
  // 만약 bcrypt를 쓴다면 salt 인자를 무시하고 아래와 같이 처리하는게 일반적입니다.
  // 하지만 현재 구조를 유지하려면:
  return bcrypt.hashSync(password, 10); // bcrypt가 알아서 salt를 생성하고 포함함
};

// 2. 로그인 시 검증 메소드 수정 🚨 핵심!
passwordSchema.methods.validPassword = function(salt: string, passwordIn: string) {
  // this.password는 DB에 저장된 해시값 ($2b$10$...) 입니다.
  // bcrypt.compareSync는 DB의 해시값에서 salt를 스스로 추출해 passwordIn과 비교합니다.
  return bcrypt.compareSync(passwordIn, this.password);
};

export const UserPassword = model<IPwd>('UserPassword', passwordSchema);