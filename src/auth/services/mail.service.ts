import { Injectable } from "@nestjs/common";

@Injectable()
export class mailService {
    async sendResetEmail(email: string, token: string): Promise<void> {
        // send email here
        console.log(`Sending password reset email to ${email} with token ${token}`);
        // implement email sending logic here
    }
}