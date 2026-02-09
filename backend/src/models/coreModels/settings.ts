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
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  settingCategory: {
    type: String,
    required: true,
    lowercase: true,
  },
  settingKey: {
    type: String,
    lowercase: true,
    required: true,
  },
  settingValue: {
    type: Schema.Types.Mixed,
  },
  valueType: {
    type: String,
    default: 'String',
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  isCoreSetting: {
    type: Boolean,
    default: false,
  },
});

export const Setting = model<SettingSchema>('Setting', settingSchema);
