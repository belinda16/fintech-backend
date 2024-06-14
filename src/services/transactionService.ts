import { getRepository, getConnection } from 'typeorm';
import { Transaction } from '../models/transaction';
import { User } from '../models/user';
import { Wallet } from '../models/wallet';
import { sendNotification } from '../utils/notifications';
import { TransactionType } from '../models/enum';

export const processTransaction = async (senderId: number, recipientId: number, amount: number, idempotencyKey: string) => {
    return await getConnection().transaction(async transactionalEntityManager => {
        const transactionRepository = transactionalEntityManager.getRepository(Transaction);
        const walletRepository = transactionalEntityManager.getRepository(Wallet);
        const userRepository = transactionalEntityManager.getRepository(User);

        const existingTransaction = await transactionRepository.findOne({ where: { idempotencyKey } });

        if (existingTransaction) {
            return existingTransaction;
        }

        const senderWallet = await walletRepository.findOne({
            where: { user: { id: senderId } },
            relations: ['user']
        });
        const recipientWallet = await walletRepository.findOne({
            where: { user: { id: recipientId } },
            relations: ['user']
        });

        if (!senderWallet || !recipientWallet) {
            throw new Error('Sender or recipient wallet not found');
        }

        if (senderWallet.balance < amount) {
            throw new Error('Insufficient funds');
        }

        const sender = await userRepository.findOne({ where: { id: senderId } });
        const recipient = await userRepository.findOne({ where: { id: recipientId } });

        if (!sender || !recipient) {
            throw new Error('Sender or recipient user not found');
        }

        senderWallet.balance = Number(senderWallet.balance) - Number(amount)
        recipientWallet.balance = Number(recipientWallet.balance) + Number(amount)


        await sendNotification(recipientId, `amnt ${(recipientWallet.balance)}  ${amount} `);

        const debitTransaction = new Transaction();
        debitTransaction.amount = amount;
        debitTransaction.timestamp = new Date();
        debitTransaction.sender = sender;
        debitTransaction.recipient = recipient;
        debitTransaction.idempotencyKey = idempotencyKey;
        debitTransaction.transactionType = TransactionType.DEBIT;
    
        const creditTransaction = new Transaction();
        creditTransaction.amount = amount;
        creditTransaction.timestamp = new Date();
        creditTransaction.sender = sender;
        creditTransaction.recipient = recipient;
        creditTransaction.idempotencyKey = idempotencyKey;
        creditTransaction.transactionType = TransactionType.CREDIT;
    
        await walletRepository.save(senderWallet);
        await walletRepository.save(recipientWallet);
        await transactionRepository.save(debitTransaction);
        await transactionRepository.save(creditTransaction);


        await sendNotification(recipientId, `You have received ${amount}`);

        return { message: "Transaction processed successfully" };
    });
};
