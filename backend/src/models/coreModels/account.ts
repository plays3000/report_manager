import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  id: string;
  email: string;
  name: string;
  lastIp: string;
  enable: Boolean;
  createdAt: Date;
  role : string;
  tempCode : string;
  tempCodeCreatedAt : Date;
}

const userSchema = new Schema<IUser>({
  id: { 
    type: String, 
    required: [true, '이메일은 필수입니다.'], 
    unique: true,
    trim: true,
    lowercase: true 
  },
  email:{
    type: String,
    requiired: false
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
  },
  tempCode: { type: String },        
  tempCodeCreatedAt: { type: Date }
}, 

{
  timestamps: true // createdAt, updatedAt 자동 생성
});

export const User = model<IUser>('User', userSchema);