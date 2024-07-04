import { Request, Response } from 'express';
import { sendEmail } from '../services/emailService';
import User from '../auth/models/User';

export const sendTestEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await sendEmail({
      to: user.email,
      subject: "Test Email",
      text: "This is a test email",
      html: "<p>This is a test email</p>",
    });

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
