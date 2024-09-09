import express, { Request, Response } from 'express';
import { register, login } from './controllers/authController';
import { authenticateToken } from './middlewares/authMiddleware';
import artsRoutes from './routes/artsRoutes';

const app = express();
app.use(express.json());

// Authentication routes
app.post('/register', register);
app.post('/login', login);
app.get('/profile', authenticateToken, (req: Request, res: Response) => {
    if (req.user) {
        res.json({ message: 'This is a protected route', user: req.user });
    } else {
        res.status(401).json({ message: 'User not authenticated' });
    }
});

// Arts routes
app.use('/api', artsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});