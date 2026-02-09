import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  id: string;
  name: string;
  lastIp: string;
  enable: Boolean;
  createdAt: Date;
  role : string;

}

const userSchema = new Schema<IUser>({
  id: { 
    type: String, 
    required: [true, '이메일은 필수입니다.'], 
    unique: true,
    trim: true,
    lowercase: true 
  },
  name: { 
    type: String, 
    required: [true, '이름은 필수입니다.'] 
  },
  lastIp: {
    type: String,
    default: ''
  },
  enable: {
    type: Boolean,
    default: true
  },
  role : {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'owner']
  }
}, 

{
  timestamps: true // createdAt, updatedAt 자동 생성
});

export const User = model<IUser>('User', userSchema);