import { Router } from 'express';
import authRouter from './auth/auth-router';
import carRouter from './cars/car-router';  // Import the car router

const router = Router();

router.use('/auth', authRouter);
router.use('/cars', carRouter);  // Add the car routes

export default router;
