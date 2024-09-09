import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser } from '../models/userModel';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (user) {
            res.status(400).json({ error: 'Email is already registered' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(email, hashedPassword);

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password!))) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};