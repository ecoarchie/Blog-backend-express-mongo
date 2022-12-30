import { UserViewModel } from '../models/userModels';

declare global {
  declare namespace Express {
    export interface Request {
      user: UserViewModel | null;
    }
  }
}
