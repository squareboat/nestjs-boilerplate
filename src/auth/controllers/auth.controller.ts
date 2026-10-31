import { Body, Controller, Inject, Post, Res, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dto/login";
import { SignupDto } from "../dto/signup";
import { RequestPasswordResetDto, ResetPasswordDto } from "../dto/password-reset";
import { UserService } from "@app/user";
import { UserDetailTransformer } from "@app/transformer";
import { type Response, RestController } from '@libs/boat';
import { UserModuleConstants } from "@app/user/constants";
import type { UserRepositoryContract } from "@app/user/repositories";


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
        // errors go to the global ExceptionFilter (422 for a taken
        // username/email, a generic 500 for anything else)
        const user = await this.authService.signup(signupDTO);

        return res.success(
            await this.transform(user, new UserDetailTransformer()),
        );
    }

    @Post('request-password-reset')
    async requestPasswordReset(@Body() body: RequestPasswordResetDto): Promise<any> {
        return await this.authService.requestPasswordReset(body.username);
    }
    @Post('reset-password')
    async resetPassword(@Body() body: ResetPasswordDto): Promise<any> {
        return await this.authService.resetPassword(body.token, body.password);
    }

}