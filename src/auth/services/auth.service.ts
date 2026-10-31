import { UserModel, UserService } from '@app/user';
import { UserModuleConstants } from '@app/user/constants';
import type { UserRepositoryContract } from '@app/user/repositories';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { mailService } from './mail.service';
import { ValidationFailed } from '@libs/boat';
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
        const errors: Record<string, string[]> = {};
        if (await this.users.exists({ username: input.username })) {
            errors.username = ['Username is already taken'];
        }
        if (await this.users.exists({ email: input.email })) {
            errors.email = ['Email is already registered'];
        }
        if (Object.keys(errors).length) throw new ValidationFailed(errors);

        // store a bcrypt hash, validateUser() compares against it
        const password = await bcrypt.hash(input.password, 10);
        // model properties are camelCase, knexSnakeCaseMappers maps them to the columns
        return this.users.create({
            firstName: input.first_name,
            lastName: input.last_name,
            dob: input.dob,
            username: input.username,
            email: input.email,
            password,
        });
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async requestPasswordReset(username: string): Promise<any> {
        const user = await this.userService.findOne(username);

        // same answer whether or not the user exists, so the endpoint
        // cannot be used to find out which usernames are registered
        if (!user) {
            return { message: 'Password reset email sent' };
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
