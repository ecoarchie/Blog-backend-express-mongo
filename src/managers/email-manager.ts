import nodemailer from 'nodemailer';
import { UserDBModel } from '../models/userModels';

export const emailManager = {
  async sendEmailConfirmationMessage(user: UserDBModel) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'app.cronosport@gmail.com',
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: 'BlogPost <app.cronosport.gmail.com>',
      to: user.email,
      subject: 'Email confirmation',
      html: `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a> </p>`,
    });
  },
};
