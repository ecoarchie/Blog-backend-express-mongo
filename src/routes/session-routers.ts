import { Router } from 'express';
import {
  deleteDeviceSessionController,
  deleteRestSessionsController,
  getActiveSessionsController,
} from '../controllers/session-controllers';

export const sessionRouter = Router();

sessionRouter.get('/', getActiveSessionsController);

sessionRouter.delete('/', deleteRestSessionsController);

sessionRouter.delete('/:deviceId', deleteDeviceSessionController);
