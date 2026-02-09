import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import {User} from '../models/coreModels/account.js';
import {UserPassword} from '../models/coreModels/password.js';
import {Setting} from '../models/coreModels/settings.js';



await connectDB();

async function deleteData(){
    await User.deleteMany();
    await UserPassword.deleteMany();
    console.log('👍 Admin Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
    await Setting.deleteMany();
    process.exit();
};

deleteData();