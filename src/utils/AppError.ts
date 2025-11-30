export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errorType?: 'alert' | 'field';
  fields?: Record<string, string>;

  constructor(statusCode: number, message: string, errorType: 'alert' | 'field' = 'alert', fields?: Record<string, string>) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errorType = errorType;
    this.fields = fields;

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
