import { type Request, type Response, RestController } from '@libs/boat';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from '../services';
import { UserDetailTransformer } from '@app/transformer';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';


@Controller('api/users')
export class UserController extends RestController {
  constructor(private service: UserService) {
    super();
  }



  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    // req.user is set by JwtStrategy.validate()
    const user = await this.service.findById(req.user.userId);

    return res.success(
      await this.transform(user, new UserDetailTransformer(), { req }),
    );
  }
}
