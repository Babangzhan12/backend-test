import { Response } from 'express';

export function jsonSuccess(
    res: Response,
    data: any,
    message = 'Success',
    status = 200,
    pagination : {total: number, totalPages: number, currentPage: number, perPage: number} | undefined ={total:0, totalPages: 0, currentPage: 1, perPage:0}
  ) {
    return res.status(status).json({
      status: true,
      message,
      data,
    });
  }
export function jsonSuccessPaginated(
    res: Response,
    data: any,
    message = 'Success',
    status = 200,
    pagination : {total: number, totalPages: number, currentPage: number, perPage: number} | undefined ={total:0, totalPages: 0, currentPage: 1, perPage:0}
  ) {
    return res.status(status).json({
      status: true,
      message,
      data,
      ...({pagination: pagination})
    });
  }

  export function jsonError(
    res: Response,
    message = 'Something went wrong',
    error: any = null,
    status = 500
  ) {
    return res.status(status).json({
      status: false,
      message,
      error: error,
      // error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }

export function jsonNotFound(
    res: Response,
    modelName: string,
    id?: string | number
  ) {
    const msg = `${modelName} ${id ? `with ID ${id} ` : ''}not found`;
    return res.status(404).json({
      status: false,
      message: msg,
    });
  }

export function jsonBadRequest(
    res: Response,
    modelName: string,
  ) {
    const msg = `${modelName} not found`;
    return res.status(400).json({
      status: false,
      message: msg,
    });
  }

export function jsonForbidden (
    res: Response,
    modelName: string,
  ) {
    const msg = `${modelName} forbidden`;
    return res.status(403).json({
      status: false,
      message: msg,
    });
  }
