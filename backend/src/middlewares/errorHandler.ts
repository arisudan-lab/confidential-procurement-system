import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

const logger = pino();

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error({ err }, 'Unhandled exception');
  res.status(500).json({
    error: 'Internal Server Error',
    message: err?.message || 'Unknown error occurred'
  });
}
