import { Injectable } from '@nestjs/common'
import nodemailer, { Transporter } from 'nodemailer'

@Injectable()
export class MailService {
    private readonly transporter: Transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',

            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },

            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
        })
    }

    async sendEmail(
        email: string,
        code: string,
    ) {
        return this.transporter.sendMail({
            from: `"Kirya" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Confirmation code',

            html: `
                <h1>Thank you for your registration</h1>

                <p>
                    To finish registration please follow the link below:
                    <br>

                    <a href="https://somesite.com/confirm-email?code=${code}">
                        complete registration
                    </a>
                </p>
            `,
        })
    }

    async sendRecoveryCode(
        email: string,
        code: string,
    ) {
        return this.transporter.sendMail({
            from: `"Kirya" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Password recovery code',

            html: `
                <h1>Password recovery</h1>

                <p>
                    To finish password recovery please follow the link below:

                    <a href="https://somesite.com/password-recovery?recoveryCode=${code}">
                        recovery password
                    </a>
                </p>
            `,
        })
    }
}