"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailManager = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.emailManager = {
    sendEmailConfirmationMessage(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: 'app.cronosport@gmail.com',
                    pass: process.env.GMAIL_PASSWORD,
                },
            });
            let info = yield transporter.sendMail({
                from: 'BlogPost <app.cronosport.gmail.com>',
                to: user.email,
                subject: 'Email confirmation',
                html: `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a> </p>`,
            });
            // console.log(info);
        });
    },
};
