import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../models/user';
import { Wallet } from '../models/wallet';
import { sendVerificationEmail } from '../utils/notifications';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const userRepository = getRepository(User);
    const walletRepository = getRepository(Wallet);
    const existingUser = await userRepository.findOne({ where: [{ username }, { email }] });

    if (existingUser) {
        return res.status(400).json({ message: 'Username or email already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    user.isVerified = false;

    const wallet = new Wallet();
    wallet.balance = 0;
    wallet.user = user;

    const verificationToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });



    await userRepository.save(user);
    await walletRepository.save(wallet);
    await sendVerificationEmail(email, verificationToken); 
    res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user || !user.password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Email not verified' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Invalid token' });
    }

    try {
        const decoded: any = jwt.verify(token as string, JWT_SECRET);
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(decoded.id);

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        user.isVerified = true;
        await userRepository.save(user);

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
