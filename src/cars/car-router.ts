import { Router } from 'express';
import { getCars, getCarsByGemini } from './car-controller';
import { authMiddleware } from '../middlewares/auth-middleware';


const carRouter = Router();

carRouter.get('/search', getCars);
carRouter.get('/search/gemini', authMiddleware, getCarsByGemini);


export default carRouter;
