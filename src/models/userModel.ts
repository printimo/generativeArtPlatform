import pool from '../db';

export interface User {
    id: number;
    email: string;
    password: string | undefined;
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
};

export const createUser = async (email: string, password: string): Promise<User> => {
    const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, password]
    );
    return result.rows[0];
};