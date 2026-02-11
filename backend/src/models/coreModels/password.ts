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
  // bcryptjs는 salt 인자를 내부에서 자동으로 처리하므로 password만 전달합니다.
  return bcrypt.hashSync(password, 10);
};

// 2. 로그인 시 검증 메소드 (비동기로 작성하는 것이 권장됩니다)
passwordSchema.methods.validPassword = function(salt: string, passwordIn: string) {
  // 가입 시 password만 넣었으므로, 검증 시에도 passwordIn만 넣습니다.
  return bcrypt.compareSync(passwordIn, this.password);
};

export const UserPassword = model<IPwd>('UserPassword', passwordSchema);