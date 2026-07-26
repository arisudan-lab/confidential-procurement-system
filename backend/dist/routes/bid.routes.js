import { Router } from 'express';
const router = Router();
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
router.post('/submit', asyncHandler(async (req, res) => {
    res.json({ success: true, message: 'Bid submitted successfully.' });
}));
export default router;
