import { Router, Request, Response, NextFunction } from 'express';
import { getWallet } from '../wallet/manager.js';
import { firstValueFrom } from 'rxjs';

const router = Router();

const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/balance', asyncHandler(async (req: Request, res: Response) => {
  const walletCtx = getWallet();
  const state = await firstValueFrom(walletCtx.wallet.state());
  const balances = state.unshielded.balances;
  
  // Return the balances
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(balances)) {
    result[key] = (value as any).toString();
  }

  res.json({ balances: result });
}));

export default router;
