import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthRequest } from './jwt.middleware'; 
import { AppError } from '../utils/AppError';

export const authorizeRoles = (allowedRoles: string[]): RequestHandler => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !user.role || !allowedRoles.includes(user?.role)) {
      return next(new AppError(403, 'Forbidden: Akses ditolak', 'alert'));
    }

    next();
  };
};
