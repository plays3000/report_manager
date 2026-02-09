import * as dotenv from 'dotenv';

dotenv.config();

import {globSync} from 'glob';
import * as fs from 'fs';
import {nanoid} from 'nanoid';
import { User } from '../models/coreModels/account.js';
import { UserPassword } from '../models/coreModels/password.js';
import { Setting } from '../models/coreModels/settings.js';
import connectDB from '../config/db.js';

await connectDB();

async function addNewCounts(
    id_input: string, 
    name_input: string, 
    password_input: string,
    role_input: string = 'user'
){
  try{
    const newUserPassword = new UserPassword();
    const salt = nanoid();
    const passwordHash = newUserPassword.generateHash(salt, password_input);

    const demoUser = {
        id: id_input,
        name: name_input,
        lastIp: '0.0.0,0',
        enable: true,
        createdAt: Date.now(),
        role : role_input,
    };
    const result = await new User(demoUser).save();

    const UserPasswordData = {
      password: passwordHash,
      emailVerified: true,
      salt: salt,
      user: result._id,
    };
    await new UserPassword(UserPasswordData).save();

    console.log('👍 User created : Done!');

    process.exit();
  } catch (e) {
    console.log('\n🚫 Error! The Error info is below');
    console.log(e);
    process.exit();
  }
  
};

async function setupApp() {
  try {
    const newAdminPassword = new UserPassword();

    const salt = nanoid();

    const passwordHash = newAdminPassword.generateHash(salt, 'admin123');

    const demoAdmin = {
      id: 'admin@admin.com',
      name: 'IDURAR',
      lastIp: '0.0.0.0',
      createdAt: Date.now(),
      enabled: true,
      role: 'admin',
    };
    const result = await new User(demoAdmin).save();

    const AdminPasswordData = {
      password: passwordHash,
      emailVerified: true,
      salt: salt,
      user: result._id,
    };
    await new UserPassword(AdminPasswordData).save();

    console.log('👍 Admin created : Done!');

    const settingFiles = [];

    const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');

    for (const filePath of settingsFiles) {
      const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      settingFiles.push(...file);
    }

    await Setting.insertMany(settingFiles);

    console.log('👍 Settings created : Done!');

    // const PaymentMode = require('../models/appModels/PaymentMode');
    // const Taxes = require('../models/appModels/Taxes');

    // await Taxes.insertMany([{ taxName: 'Tax 0%', taxValue: '0', isDefault: true }]);
    // console.log('👍 Taxes created : Done!');

    // await PaymentMode.insertMany([
    //   {
    //     name: 'Default Payment',
    //     description: 'Default Payment Mode (Cash , Wire Transfert)',
    //     isDefault: true,
    //   },
    // ]);
    // console.log('👍 PaymentMode created : Done!');

    console.log('🥳 Setup completed :Success!');
    process.exit();
  } catch (e) {
    console.log('\n🚫 Error! The Error info is below');
    console.log(e);
    process.exit();
  }
}

setupApp();
