import { Router } from 'express';
import { getCars, getCarsByGemini } from './car-controller';

const carRouter = Router();

carRouter.get('/search', getCars);
carRouter.get('/search/gemini', getCarsByGemini);

export default carRouter;
