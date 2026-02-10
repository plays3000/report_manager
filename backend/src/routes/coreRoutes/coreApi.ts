import express from 'express';
import type { Request, Response } from 'express';
import { isValidToken } from '../../middlewares/authMiddlewares.js';
import { User } from '../../models/coreModels/account.js';

const router = express.Router();

/**
 * @route   GET /api/core/profile
 * @desc    현재 로그인한 사용자의 프로필 정보 조회
 * @access  Private (Valid Token Required)
 */
router.get('/profile', isValidToken, async (req: any, res: Response) => {
  try {
    // 1. 미들웨어에서 넣어준 req.user 정보를 활용
    // loginUser 서비스에서 토큰 생성 시 { userId, role }를 넣었으므로 여기서 꺼낼 수 있습니다.
    const userId = req.user.userId;

    // 2. DB에서 최신 사용자 정보 조회 (보안상 민감한 정보는 제외)
    const user = await User.findById(userId).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 le수 없습니다.'
      });
    }

    // 3. 결과 반환
    return res.status(200).json({
      success: true,
      result: user
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: '서버 에러가 발생했습니다.',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/core/status
 * @desc    서버 및 인증 상태 확인
 * @access  Private
 */
router.get('/status', isValidToken, (req: any, res: Response) => {
  res.status(200).json({
    success: true,
    message: '인증되었습니다.',
    authInfo: req.user // 토큰에 담긴 데이터 확인용
  });
});

export default router;