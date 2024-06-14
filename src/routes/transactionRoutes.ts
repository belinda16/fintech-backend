import express from 'express';
import { initiateTransaction, getTransactionHistory } from '../controllers/transactionController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/send', authMiddleware, initiateTransaction);
router.get('/history', authMiddleware, getTransactionHistory);

export default router;
