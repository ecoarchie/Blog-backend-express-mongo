import { Router } from 'express';
import { getCurrentUserInfoController, loginUserController } from '../controllers/auth-controllers';
import { jwtAuthMware } from '../middlewares/jwt-auth-mware';

export const authRouter = Router();

authRouter.post('/login', loginUserController);

authRouter.get('/me', jwtAuthMware, getCurrentUserInfoController);
