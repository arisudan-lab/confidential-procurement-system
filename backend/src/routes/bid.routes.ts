import { Router, Request, Response, NextFunction } from 'express';
import { submitBidContract } from '../contracts/procurement.js';
import crypto from 'node:crypto';

const router = Router();

const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/submit', asyncHandler(async (req: Request, res: Response) => {
  const { amount, secret, supplier } = req.body;
  if (amount === undefined || !secret || !supplier) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Generate secure random nonce for the bid
    const nonce = new Uint8Array(crypto.randomBytes(32));
    
    // Hash supplier address and secret to fit Bytes<32>
    const supplierBytes = new Uint8Array(crypto.createHash('sha256').update(supplier).digest());
    const secretBytes = new Uint8Array(crypto.createHash('sha256').update(secret).digest());
    
    if (!Number.isSafeInteger(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Bid amount must be a positive whole number.' });
    }
    const bidAmount = BigInt(Number(amount));

    // Generate ZK proof and call contract
    await submitBidContract(supplierBytes, bidAmount, secretBytes, nonce);
    
    res.json({ 
      success: true, 
      message: 'Bid submitted successfully to Midnight Network.'
    });
  } catch (err: any) {
    console.error('Proof Generation/Submission Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Proof failure or contract rejection',
      error: err.message
    });
  }
}));

export default router;
