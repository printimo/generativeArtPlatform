import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: number;
    email: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access denied' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: TokenPayload | undefined) => {
        if (err) {
            res.status(403).json({ error: 'Invalid token' });
            return;
        }
        if (decoded) {
            req.user = {
                id: decoded.id,
                email: decoded.email,
                password: undefined
            };
        }
        next();
    });
};