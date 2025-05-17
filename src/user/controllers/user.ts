import { Request, Response, RestController } from '@libs/boat';
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
    const user = await this.service.get();
    console.log(user);
    
    return res.success(
      await this.transform(user, new UserDetailTransformer(), { req }),
    );
  }
}
