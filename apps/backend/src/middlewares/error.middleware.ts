import { Request, Response } from 'express';

interface CustomError extends Error {
  status?: number;
  statusCode?: number;
}

export const errorHandler = (err: CustomError, _req: Request, res: Response) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    url: _req.url,
    method: _req.method,
  });

  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.message.includes('Unique constraint')) {
    status = 409;
    message = 'Resource already exists';
  } else if (err.message.includes('Record to update not found')) {
    status = 404;
    message = 'Resource not found';
  } else if (err.message.includes('Foreign key constraint')) {
    status = 400;
    message = 'Invalid reference to related resource';
  }

  if (status === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error';
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
