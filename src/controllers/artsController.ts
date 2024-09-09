import { Request, Response } from 'express';
import { getArts, getArtById, createArt, updateArt, deleteArt } from '../models/artModel';

export const fetchArts = async (req: Request, res: Response): Promise<void> => {
    try {
        const arts = await getArts();
        res.json(arts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch arts', error: err.message });
    }
};

export const fetchArtById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const art = await getArtById(parseInt(id));
        if (art) {
            res.json(art);
        } else {
            res.status(404).json({ message: 'Art not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch art', error: err.message });
    }
};

export const addArt = async (req: Request, res: Response): Promise<void> => {
    const { profileId, jsCode, previewImages } = req.body;

    try {
        const newArt = await createArt(profileId, jsCode, previewImages);
        res.status(201).json(newArt);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create art', error: err.message });
    }
};

export const modifyArt = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { jsCode, previewImages } = req.body;

    try {
        const updatedArt = await updateArt(parseInt(id), jsCode, previewImages);
        if (updatedArt) {
            res.json(updatedArt);
        } else {
            res.status(404).json({ message: 'Art not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to update art', error: err.message });
    }
};

export const removeArt = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await deleteArt(parseInt(id));
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete art', error: err.message });
    }
};