import pool from '../db';

export interface Art {
    id: number;
    profileId: number;
    jsCode: string;
    previewImages: string[];
}

export const getArts = async (): Promise<Art[]> => {
    const result = await pool.query('SELECT * FROM arts');
    return result.rows;
};

export const getArtById = async (id: number): Promise<Art | null> => {
    const result = await pool.query('SELECT * FROM arts WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const createArt = async (profileId: number, jsCode: string, previewImages: string[]): Promise<Art> => {
    const result = await pool.query(
        'INSERT INTO arts (profile_id, js_code, preview_images) VALUES ($1, $2, $3) RETURNING *',
        [profileId, jsCode, previewImages]
    );
    return result.rows[0];
};

export const updateArt = async (id: number, jsCode: string, previewImages: string[]): Promise<Art | null> => {
    const result = await pool.query(
        'UPDATE arts SET js_code = $1, preview_images = $2 WHERE id = $3 RETURNING *',
        [jsCode, previewImages, id]
    );
    return result.rows[0] || null;
};

export const deleteArt = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM arts WHERE id = $1', [id]);
};