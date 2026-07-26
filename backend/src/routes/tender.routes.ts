import { Router, Request, Response, NextFunction } from 'express';
import { getContract, getBidCount } from '../contracts/procurement.js';

const router = Router();

const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/state', asyncHandler(async (req: Request, res: Response) => {
  try {
    const bidCount = await getBidCount();
    res.json({ success: true, bidCount });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to read contract state', error: err.message });
  }
}));

router.post('/create', asyncHandler(async (req: Request, res: Response) => {
  const contractInfo = getContract();
  
  // NOTE: In the real integration, we'd use midnight-js-contracts to invoke the createTender circuit
  // using findDeployedContract(providers, contractInfo.address, contractInfo.compiledContract)
  
  res.json({
    success: true,
    message: 'Tender creation simulated (Contract invocation requires full findDeployedContract setup)',
    contractAddress: contractInfo.address
  });
}));

router.post('/:id/close', asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: `Tender ${req.params.id} closed.` });
}));

router.post('/:id/award', asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: `Tender ${req.params.id} awarded.` });
}));

export default router;
