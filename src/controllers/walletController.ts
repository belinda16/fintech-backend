import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Wallet } from '../models/wallet';

export const getWalletBalance = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const walletRepository = getRepository(Wallet);
  const wallet = await walletRepository.findOne({ where: { user: userId } });

  if (!wallet) {
    return res.status(404).json({ message: 'Wallet not found' });
  }

  res.status(200).json({ balance: wallet.balance });
};
