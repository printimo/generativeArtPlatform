import pool from "./db";
import dotenv from 'dotenv';

dotenv.config();

// Function to execute a query
async function query(text: string, params?: any[]): Promise<void> {
    try {
        await pool.query(text, params);
        console.log('Query executed successfully');
    } catch (err) {
        console.error('Query error', err);
    }
}

// Function to create tables
async function createTables() {
    try {

        // Create profiles table
        await query(`
            CREATE TABLE IF NOT EXISTS profiles (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                oauth_provider TEXT NOT NULL,
                oauth_id TEXT NOT NULL UNIQUE
            );
        `);

        console.log('Profiles table created or already exists');

        // Create arts table
        await query(`
            CREATE TABLE arts (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                file_url TEXT NOT NULL,
                preview_images_url TEXT[],
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Arts table created or already exists');

    } catch (err) {
        console.error('Error creating tables', err);
    } finally {
        // Close the database pool
        await pool.end();
    }
}

// Run the createTables function
createTables();
