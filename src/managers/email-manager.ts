import nodemailer from 'nodemailer';
import { UserDBModel } from '../models/userModels';

export const emailManager = {
  transporter: nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'app.cronosport@gmail.com',
      pass: process.env.GMAIL_PASSWORD,
    },
  }),

  async sendEmailConfirmationMessage(user: UserDBModel) {
    let info = await this.transporter.sendMail({
      from: 'BlogPost <app.cronosport.gmail.com>',
      to: user.email,
      subject: 'Email confirmation',
      html: `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a> </p>`,
    });
  },

  async sendPasswordRecoveryMessage(user: UserDBModel) {
    let info = await this.transporter.sendMail({
      from: 'BlogPost <app.cronosport.gmail.com>',
      to: user.email,
      subject: 'Password Recovery',
      html: `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${user.passwordRecovery.recoveryCode}'>recovery password</a>
      </p>`,
    });
  },
};
