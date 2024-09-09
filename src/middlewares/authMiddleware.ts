import {NextFunction, Request, Response} from 'express';
import jwt , { VerifyErrors } from 'jsonwebtoken';

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

    jwt.verify(token, process.env.JWT_SECRET!, (err: VerifyErrors | null, token?: object | string) => {
        const userToken = token as TokenPayload;
        if (err || !userToken) {
            res.status(403).json({ error: 'Invalid token' });
            return;
        }
        req.user = {
            id: userToken.id,
            email: userToken.email,
            password: undefined
        };
        next();
    });
};