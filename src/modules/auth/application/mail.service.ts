import { Injectable } from '@nestjs/common'
import nodemailer, { Transporter } from 'nodemailer'

@Injectable()
export class MailService {
    private readonly transporter: Transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',

            auth: {
                user: 'cyb3ik.dev@gmail.com',
                pass: 'xogk dxhh wnbw jwbq'
            }
        })
    }

    async sendEmail(
        email: string,
        code: string,
    ) {
        const info = await this.transporter.sendMail({
            from: `"Kirya" <code>`,
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

        return info
    }

    async sendRecoveryCode(
        email: string,
        code: string,
    ) {
        const info = await this.transporter.sendMail({
            from: `"Kirya" <code>`,
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

        return info
    }
}