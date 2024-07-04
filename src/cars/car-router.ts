import { Router } from 'express';
import { getCars, getCarsByGemini, checkNewCars, searchAsGuest } from './car-controller';
import { authMiddleware } from '../middlewares/auth-middleware';


const carRouter = Router();

carRouter.get('/search', getCars);
carRouter.get('/search/gemini', authMiddleware, getCarsByGemini);
carRouter.get('/search/guest', searchAsGuest);
carRouter.get('/check-new-cars', authMiddleware, checkNewCars);


export default carRouter;
