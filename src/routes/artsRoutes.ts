import { Router } from 'express';
import { fetchArts, fetchArtById, addArt, modifyArt, removeArt } from '../controllers/artsController';

const router = Router();

router.get('/arts', fetchArts);
router.get('/arts/:id', fetchArtById);
router.post('/arts', addArt);
router.put('/arts/:id', modifyArt);
router.delete('/arts/:id', removeArt);

export default router;