import { Router } from 'express';
import authRouter from './auth/auth-router';
import carRouter from './cars/car-router';  // Import the car router
import emailRouter from './emails/email-router';

const router = Router();

router.use('/auth', authRouter);
router.use('/cars', carRouter);  // Add the car routes
router.use('/emails', emailRouter);

export default router;
