import express, { Router } from 'express';
// @/ 핸들러와 컨트롤러의 실제 경로에 맞춰 임포트하세요.
import { catchErrors } from '@/handlers/errorHandlers';
import * as adminAuth from '@/controllers/coreControllers/adminAuth';

const router: Router = express.Router();

/**
 * @description 로그인 라우트 (최종 주소: /api/login)
 */
router.route('/login').post(catchErrors(adminAuth.login));

/**
 * @description 비밀번호 분실 및 초기화
 */
router.route('/forgetpassword').post(catchErrors(adminAuth.forgetPassword));
router.route('/resetpassword').post(catchErrors(adminAuth.resetPassword));

/**
 * @description 로그아웃 (인증 토큰 확인 후 처리)
 */
router.route('/logout').post(
  adminAuth.isValidAuthToken, 
  catchErrors(adminAuth.logout)
);

export default router;