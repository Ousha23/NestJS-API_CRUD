import { Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer"

// config pour l'envoi de mail après inscription
@Injectable()
export class MailerService {
    
    private async transporter() {
        const testAccount = await nodemailer.createTestAccount()
        const transport = nodemailer.createTransport({
            host: "localhost",
            port: 1025,
            ignoreTLS: true,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        })
        return transport
    }
    async sendSignupConfirmation(userEmail: string) {
        (await this.transporter()).sendMail({
            from: "app@localhost.com",
            to: userEmail,
            subject: "confirmation",
            html: "<h3>Confirmation of inscription</h3>"
        })
    }
    async sendResetPassword(userEmail: string, url: string, code: string) {
        (await this.transporter()).sendMail({
            from: "app@localhost.com",
            to: userEmail,
            subject: "Reset password",
            html: `
            <a href='${url}'></a>
            <p>Secret code <strong>${code}</strong></p>
            <p>Code will expire in 15 minutes</p>
            `,
        })
    }
    async sendResetPasswordConfirmation(userEmail: string) {
        (await this.transporter()).sendMail({
            from: "app@localhost.com",
            to: userEmail,
            subject: "Confirmation reset password",
            html: "<h3>Password updated successfully</h3>"
        })
    }
    
}
