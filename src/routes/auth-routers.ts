import { Router } from 'express';
import {
  loginLimiter,
  newPasswordLimiter,
  passwordRecoveryLimiter,
  regConfirmLimiter,
  registerUserLimiter,
  resendRegEmailLimiter,
} from '../application/rate-limits';
import {
  confirmPasswordController,
  getCurrentUserInfoController,
  loginUserController,
  logoutController,
  passwordRecoveryController,
  refreshTokenController,
  regConfirmController,
  registerUserController,
  resendRegEmailController,
} from '../controllers/auth-controllers';
import {
  emailValidation,
  inputValidatiomMiddleware,
  newPasswordValidation,
  userBodyValidation,
} from '../middlewares/input-validation-middleware';
import { jwtAuthMware } from '../middlewares/jwt-auth-mware';

export const authRouter = Router();

authRouter.post('/login', loginLimiter, loginUserController);

authRouter.get('/me', jwtAuthMware, getCurrentUserInfoController);

authRouter.post(
  '/registration',
  registerUserLimiter,
  userBodyValidation(),
  inputValidatiomMiddleware,
  registerUserController
);

authRouter.post(
  '/registration-confirmation',
  regConfirmLimiter,
  regConfirmController
);

authRouter.post(
  '/registration-email-resending',
  resendRegEmailLimiter,
  emailValidation(),
  inputValidatiomMiddleware,
  resendRegEmailController
);

authRouter.post('/refresh-token', refreshTokenController);

authRouter.post('/logout', logoutController);

authRouter.post(
  '/password-recovery',
  passwordRecoveryLimiter,
  emailValidation(),
  inputValidatiomMiddleware,
  passwordRecoveryController
);

authRouter.post(
  '/new-password',
  newPasswordLimiter,
  newPasswordValidation(),
  inputValidatiomMiddleware,
  confirmPasswordController
);
