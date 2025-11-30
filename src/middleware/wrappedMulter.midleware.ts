import { MulterError } from 'multer';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '../utils/AppError';

export const wrapMulter = (upload: (req: Request, res: Response, cb: (error?: any) => void) => void): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err?: any) => {
      if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError(400, 'Ukuran file terlalu besar', 'field', { fotoProfile: 'Ukuran file terlalu besar' }));
        }
        return next(new AppError(400, err.message, 'alert'));
      } else if (err) {
        return next(new AppError(400, err.message, 'alert'));
      }
      next();
    });
  };
};
