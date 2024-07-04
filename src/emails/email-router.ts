import express from 'express';
import { sendTestEmail } from './email-controller';

const emailRouter = express.Router();

emailRouter.post('/send-test-email/:id', sendTestEmail);

export default emailRouter;
