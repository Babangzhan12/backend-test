import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ValidationError, DatabaseError, UniqueConstraintError, ConnectionError } from 'sequelize';
import { AppError } from '../utils/AppError';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      status: 'error',
      errorType: err.errorType,
      fields: err.fields ?? null,
    });
  } else if (err instanceof ValidationError) {
    res.status(400).json({
      message: `Validasi gagal ${err.message}`,
      status: 'error',
      errorType: 'field',
      fields: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
  } else if (err instanceof UniqueConstraintError) {
    res.status(400).json({
      message: `Data sudah ada ${err.message}`,
      status: 'error',
      errorType: 'field',
      fields: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
  } else if (err instanceof DatabaseError) {
    res.status(400).json({
      message: `Kesalahan ${err.message}`,
      status: 'error',
      errorType: 'alert',
    });
  } else if (err instanceof ConnectionError) {
    res.status(500).json({
      message: 'Gagal terhubung ke server',
      status: 'error',
      errorType: 'alert',
    });
  } else if (err instanceof Error) {
    res.status(500).json({
      message: err.message,
      status: 'error',
      errorType: 'alert',
    });
  } else {
    res.status(500).json({
      message: 'Unknown error occurred',
      status: 'error',
    });
  }
};
