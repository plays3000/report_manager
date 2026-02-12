import { Schema, model, Document } from 'mongoose';

interface SettingSchema extends Document {
    removed: Boolean;
    enabled: Boolean;
    settingCategory: String;
    settingKey: String;
    settingValue: Schema.Types.Mixed;
    valueType: String;
    isPrivate: Boolean;
    isCoreSetting: Boolean;
}

const settingSchema = new Schema<SettingSchema>({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },

  // 카테고리별로 묶어서 관리 (예: email)
  settingCategory: {
    type: String,
    required: true,
    lowercase: true,
    index: true, // 검색 최적화
  },
  
  // 구체적인 설정 이름 (예: email_user)
  settingKey: {
    type: String,
    lowercase: true,
    required: true,
    unique: true, // 중복 설정 방지
  },

  settingValue: {
    type: Schema.Types.Mixed,
    required: true,
  },

  valueType: {
    type: String,
    default: 'String',
  },

  // 비밀번호나 API 키 같은 민감 정보 여부
  isPrivate: {
    type: Boolean,
    default: false,
  },

  isCoreSetting: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const Setting = model<SettingSchema>('Setting', settingSchema);