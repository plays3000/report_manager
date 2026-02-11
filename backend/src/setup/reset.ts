import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import {User} from '../models/coreModels/account.js';
import {UserPassword} from '../models/coreModels/password.js';
import {Setting} from '../models/coreModels/settings.js';

connectDB().catch((err) => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});

async function deleteData(){
    await User.deleteMany();
    await UserPassword.deleteMany();
    console.log('👍 Admin Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
    await Setting.deleteMany();
    process.exit();
};

deleteData();