import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import walletRoutes from './routes/walletRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { connectDB } from './utils/db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

connectDB().then(() => {
  console.log('Database connected');
}).catch(err => {
  console.error('Database connection failed', err);
});

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transaction', transactionRoutes);

export default app;
