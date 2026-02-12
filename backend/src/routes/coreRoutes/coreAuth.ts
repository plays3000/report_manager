import express from 'express';
import * as authController from '../../controllers/authController.js';

const router = express.Router();

// app.ts에서 /api/auth를 붙였으므로, 여기서는 /login만 써야 합니다.
router.post('/register', authController.register); // 회원가입 
router.post('/login', authController.login);   // login
router.post('/verify-2fa', authController.verifySecondFactor);

export default router;