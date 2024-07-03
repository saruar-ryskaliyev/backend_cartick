import express from 'express';
import { getCars, getCarsByGemini } from './car-controller';

const router = express.Router();

router.get('/search', getCars);
router.get('/search/gemini', getCarsByGemini);


export default router;
