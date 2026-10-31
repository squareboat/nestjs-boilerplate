import { UserModel, UserService } from '@app/user';
import { UserModuleConstants } from '@app/user/constants';
import type { UserRepositoryContract } from '@app/user/repositories';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { mailService } from './mail.service';
import { SignupDto } from '../dto/signup';



@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private mailService: mailService,
        @Inject(UserModuleConstants.userRepo) private users: UserRepositoryContract,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne(username);

        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async signup(input: SignupDto): Promise<UserModel> {
        // store a bcrypt hash, validateUser() compares against it
        const password = await bcrypt.hash(input.password, 10);
        return this.users.create({ ...input, password });
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async requestPasswordReset(username: string): Promise<any> {
        const user = await this.userService.findOne(username);

        if (!user) {
            throw new Error('User not found');
        }
        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload, { secret: process.env.RESET_PASSWORD_SECRET, expiresIn: '1h' });

        await this.mailService.sendResetEmail(user.email, token);

        return { message: 'Password reset email sent' };
    }

    async resetPassword(token: string, newPassword: string): Promise<any> {
        try {
            const payload = this.jwtService.verify(token, { secret: process.env.RESET_PASSWORD_SECRET });

            const user = await this.users.firstWhere({ id: payload.sub });

            if (!user) {
                throw new Error('User not found');
            }
            const newpassword: string = await bcrypt.hash(newPassword, 10);
            await this.users.update(user, { password: newpassword });
            return { message: 'Password reset successful' };
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Invalid token or password');
        }
    }
}
