import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Transaction } from '../models/transaction';
import { User } from '../models/user';
import { Wallet } from '../models/wallet';
import { processTransaction } from '../services/transactionService';

export const initiateTransaction = async (req: Request, res: Response) => {
  const { recipientId, amount, idempotencyKey } = req.body;
  const senderId = (req as any).user.userId;

  try {
    const result = await processTransaction(senderId, recipientId, amount, idempotencyKey);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const getTransactionHistory = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const transactionRepository = getRepository(Transaction);
  const transactions = await transactionRepository.find({ where: [{ sender: userId }, { recipient: userId }] });

  res.status(200).json(transactions);
};
