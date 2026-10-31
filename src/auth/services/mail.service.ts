import { Injectable } from "@nestjs/common";

@Injectable()
export class mailService {
    async sendResetEmail(email: string, token: string): Promise<void> {
        // Send `token` to `email` with your mail provider here.
        // Do not log the token: anyone who can read the logs could use it
        // to reset the password.
        console.log(`Password reset requested for ${email}, email sending is not implemented`);
    }
}