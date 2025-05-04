import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  // Create a transporter using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: process.env.EMAIL_SERVER_SECURE === "true",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Set default sender
  const defaultFrom = process.env.EMAIL_FROM || "noreply@yourdomain.com";

  // Send the email
  const info = await transporter.sendMail({
    from: from || defaultFrom,
    to,
    subject,
    html,
  });

  return info;
}
