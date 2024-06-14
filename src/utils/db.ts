import { createConnection } from 'typeorm';
import { User } from '../models/user';
import { Wallet } from '../models/wallet';
import { Transaction } from '../models/transaction';

export const connectDB = async () => {
  await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Wallet, Transaction],
    synchronize: true,
  });
};
