import { Router } from 'express';
import { getWallet } from '../wallet/manager.js';
import { firstValueFrom } from 'rxjs';
const router = Router();
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
router.get('/balance', asyncHandler(async (req, res) => {
    const walletCtx = getWallet();
    const state = await firstValueFrom(walletCtx.wallet.state());
    const balances = state.unshielded.balances;
    // Return the balances
    const result = {};
    for (const [key, value] of Object.entries(balances)) {
        result[key] = value.toString();
    }
    res.json({ balances: result });
}));
export default router;
