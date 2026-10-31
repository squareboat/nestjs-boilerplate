import { UserModel, UserService } from '@app/user';
import { UserModuleConstants } from '@app/user/constants';
import type { UserRepositoryContract } from '@app/user/repositories';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UniqueViolationError } from 'objection';
import { mailService } from './mail.service';
import { ValidationFailed } from '@libs/boat';
import { SignupDto } from '../dto/signup';
import { ACCESS_TOKEN, RESET_PASSWORD_TOKEN, passwordFingerprint, resetPasswordSecret } from '../secrets';



// bcrypt hash (cost 10, like real ones) of a random value nobody knows.
// Compared against when the username does not exist, so a failed login
// takes about as long either way.
const DUMMY_PASSWORD_HASH = '$2b$10$/ieTi8IyUOQ.HHrCoNPS4e3JKTprZD97CmbAor/mwW3KRdObGjTxa';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private mailService: mailService,
        @Inject(UserModuleConstants.userRepo) private users: UserRepositoryContract,
    ) { }

    async validateUser(username: string, password: string): Promise<UserModel | null> {
        const user = await this.userService.findOne(username);

        // always run bcrypt, otherwise unknown usernames answer much faster
        const ok = await bcrypt.compare(password, user?.password ?? DUMMY_PASSWORD_HASH);
        return user && ok ? user : null;
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
        try {
            // model properties are camelCase, knexSnakeCaseMappers maps them to the columns
            return await this.users.create({
                firstName: input.first_name,
                lastName: input.last_name,
                dob: input.dob,
                username: input.username,
                email: input.email,
                password,
            });
        } catch (e) {
            // Two signups with the same username/email at once both pass the
            // checks above; the unique index rejects the second insert.
            if (e instanceof UniqueViolationError) {
                const where = `${e.constraint ?? ''} ${(e.columns ?? []).join(' ')}`;
                if (where.includes('email')) {
                    throw new ValidationFailed({ email: ['Email is already registered'] });
                }
                if (where.includes('username')) {
                    throw new ValidationFailed({ username: ['Username is already taken'] });
                }
            }
            throw e;
        }
    }

    async login(user: UserModel) {
        const payload = {
            username: user.username,
            sub: user.id,
            typ: ACCESS_TOKEN,
            // ties the token to the current password, see JwtStrategy.validate()
            pwd: passwordFingerprint(user.password),
        };

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
        const payload = { sub: user.id, typ: RESET_PASSWORD_TOKEN };
        const token = this.jwtService.sign(payload, {
            secret: resetPasswordSecret(user.password),
            expiresIn: '1h',
        });

        await this.mailService.sendResetEmail(user.email, token);

        return { message: 'Password reset email sent' };
    }

    async resetPassword(token: string, newPassword: string): Promise<any> {
        const invalid = new BadRequestException('Invalid token or password');

        // The token is signed with the user's current password hash, so the
        // user is needed before it can be verified. The unverified `sub` is
        // only used for that lookup.
        const claims = this.jwtService.decode(token);
        if (claims?.typ !== RESET_PASSWORD_TOKEN || !claims.sub) throw invalid;

        const user = await this.users.firstWhere({ id: claims.sub }, false);
        if (!user) throw invalid;

        try {
            this.jwtService.verify(token, { secret: resetPasswordSecret(user.password) });
        } catch {
            throw invalid;
        }

        // changing the hash also invalidates this and every other reset token
        const password: string = await bcrypt.hash(newPassword, 10);
        await this.users.update(user, { password });
        return { message: 'Password reset successful' };
    }
}
