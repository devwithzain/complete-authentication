import { Resend } from 'resend';
const domain = process.env.NEXT_PUBLIC_APP_URL;
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
   await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Two Factor Authentication',
      html: `
         <p>Your two factor authentication code is: ${token}</p>
      `,
   });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
   const resetLink = `${domain}/new-password?token=${token}`;

   await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password',
      html: `
         <p>Please reset your password by clicking the link below:</p>
         <a href="${resetLink}">reset your password</a>
      `,
   });
};

export const sendverificationEmail = async (email: string, token: string) => {
   const confirmLink = `${domain}/new-verification?token=${token}`;

   await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Confirm your email',
      html: `
         <p>Please confirm your email by clicking the link below:</p>
         <a href="${confirmLink}">Confirm Email</a>
      `,
   });
};