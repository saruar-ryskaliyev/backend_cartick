import nodemailer from 'nodemailer';

const smtpTransport = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525, // 8025, 587, and 25 can also be used.
  auth: {
    user: "saruar", // Replace with your SMTP2GO username
    pass: "saruar", // Replace with your SMTP2GO password
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: "Saruar Ryskaliyev <saruar.ryskaliyev@nu.edu.kz>", // Replace with your sender email and name
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const response = await smtpTransport.sendMail(mailOptions);
    console.log("Message sent: " + response.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};
