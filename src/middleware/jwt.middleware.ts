import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

const SECRET_KEY: string = process.env.SECRET_KEY || "secret";
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET ?? "TODO REFRESH TOKEN SECRET";

export interface AuthUser {
  userId: string;
  role: string;      
  username?: string; 
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface RefreshTokenJwtPayload {
  userId: string;
  role?: string;
  username?: string; 
}

export const authenticateJWT = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Unauthorized', 'alert'));
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new AppError(401, 'Token tidak valid atau sudah expired', 'alert'));
    }
    req.user = decoded as AuthUser;
    next();
  });
};

export const generateToken = (user: { userId: string ,role?: string, username?: string }) => {
  return jwt.sign(
    {
      userId: user.userId,
      role: user.role,
        username: user.username
    },
    SECRET_KEY,
    { expiresIn: '2m' } 
  )
};

export const generateRefreshToken = (user: { userId: string ,role?: string, username?: string  }) => {
  return jwt.sign(
    { userId: user.userId, role: user.role, username: user.username}, 
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

export function verifyRefreshToken(token: string, res?: Response): (JwtPayload & RefreshTokenJwtPayload) | null {
    try {   
      const payload = jwt.verify(token, REFRESH_TOKEN_SECRET, {
        complete: false,
      }) as JwtPayload & RefreshTokenJwtPayload;
      
      console.log("check",payload)
      return {
        userId: payload.userId,
        role: payload.role,
        username: payload.username
      };
    } catch (error) {
      throw new JsonWebTokenError('Invalid or expired refresh token');
    }

}
