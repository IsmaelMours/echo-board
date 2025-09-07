import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { UserRoles } from '../../common/build';

declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: string;
        email: string;
        role: UserRoles;
      };
    }
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser || req.currentUser.role !== UserRoles.Admin) {
    throw new NotAuthorizedError();
  }

  next();
};