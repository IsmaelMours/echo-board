import { UserRoles } from '../../common/build';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../errors/not-authorized-error';

interface UserPayload {
  id: string;
  email: string;
  role: UserRoles;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Inside currentUser middleware");
  console.log("req.session:", req.session);
  console.log("req.session.jwt:", req.session?.jwt);
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
  }

  next();
};
