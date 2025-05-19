import { Body, Controller, Inject, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dto/login";
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SignupDto } from "../dto/signup";
import { UserService } from "@app/user";
import { UserDetailTransformer } from "@app/transformer";
import { Request, Response, RestController } from '@libs/boat';
import { UserModuleConstants } from "@app/user/constants";
import { UserRepositoryContract } from "@app/user/repositories";


@Controller('api/auth')
export class AuthController extends RestController {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        @Inject(UserModuleConstants.userRepo) private users: UserRepositoryContract,
    ) {
        super();
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<any> {
        const user = await this.authService.validateUser(
            loginDto.username,
            loginDto.password,
        )

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.authService.login(user);
    }

    @Post('signup')
    async signup(
        @Body() signupDTO: SignupDto,
        @Res() res: Response,
    ): Promise<Response> {
        try {


            // if (signupDTO.username) {
            //     const user = await this.users.firstWhere({ username: signupDTO.username });
            //     if (user) {
            //         throw new Error('Username already exists');
            //     }
            // }
            const user = await this.users.create(signupDTO);

            return res.success(
                await this.transform(user, new UserDetailTransformer()),
            );

        } catch (error) {
            console.error('Signup error:', error);

            return res.error({
                message: error.message || 'Something went wrong',
                statusCode: error.status || 500,
            });
        }
    }

    @Post('request-password-reset')
    async requestPasswordReset(@Body('username') username: string): Promise<any> {
        return await this.authService.requestPasswordReset(username);
    }
    @Post('reset-password')
    async resetPassword(@Body('token') token: string, @Body('password') password: string): Promise<any> {
        return await this.authService.resetPassword(token, password);
    }

}