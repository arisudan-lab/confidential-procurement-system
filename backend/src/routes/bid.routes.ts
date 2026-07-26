import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/submit', asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Bid submitted successfully.' });
}));

export default router;
