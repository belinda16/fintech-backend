
import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or use any other email service
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });


    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions);
};

export const sendNotification = async (userId: number, message: string) => {
    // Implement real-time notification logic
    console.log(`Notification to user ${userId}: ${message}`);
};
