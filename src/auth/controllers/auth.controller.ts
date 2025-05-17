import { Body, Controller, Post, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dto/login";
import { JwtAuthGuard } from '../guards/jwt-auth.guard';


@Controller('api/auth')
export class AuthController {

    constructor(private authService: AuthService) { }

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

    @UseGuards(JwtAuthGuard)
    @Post('profile')
    getProfile(@Request() req) {
      return req.user;
    }

}