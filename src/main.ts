import express, { Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library'; // Example OAuth provider

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Google OAuth client setup (example)
const oauthClient = new OAuth2Client(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET);

async function query(text: string, params?: any[]): Promise<QueryResult<any>> {
    const start = Date.now();
    try {
        const res: QueryResult<any> = await pool.query(text, params);
        console.log('Executed query', { text, duration: Date.now() - start });
        return res;
    } catch (err) {
        console.error('Query error', err);
        throw err;
    }
}

// OAuth route example
app.post('/auth/google', async (req: Request, res: Response) => {
    const { idToken } = req.body;
    try {
        const ticket = await oauthClient.verifyIdToken({
            idToken,
            audience: process.env.OAUTH_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload) {
            // Handle user profile and OAuth information
            const { sub, name } = payload;
            // Check if user exists and create if not
            const result = await query('SELECT * FROM profiles WHERE oauth_id = $1', [sub]);
            if (result.rowCount === 0) {
                await query('INSERT INTO profiles (name, oauth_provider, oauth_id) VALUES ($1, $2, $3)', [name, 'google', sub]);
            }
            res.status(200).json({ message: 'User authenticated' });
        } else {
            res.status(400).json({ message: 'Invalid token' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Authentication failed', error: err.message });
    }
});

// Add routes for managing arts
app.post('/arts', async (req: Request, res: Response) => {
    const { profileId, jsCode, previewImages } = req.body;
    try {
        const result = await query('INSERT INTO arts (profile_id, js_code, preview_images) VALUES ($1, $2, $3) RETURNING *', [profileId, jsCode, previewImages]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create art', error: err.message });
    }
});

app.get('/arts', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM arts');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch arts', error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});