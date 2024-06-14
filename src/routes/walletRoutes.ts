import express from 'express';
import { getWalletBalance } from '../controllers/walletController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/balance', authMiddleware, getWalletBalance);

export default router;
