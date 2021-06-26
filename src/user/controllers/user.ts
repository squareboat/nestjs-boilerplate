import { Request, Response, RestController, WithAlias } from '@libs/core';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { UserService } from '../services';
import { UserDetailTransformer } from '@app/transformer';

@Controller('users')
export class UserController extends RestController {
  constructor(private users: UserService) {
    super();
  }

  @Get('/profile')
  @WithAlias('auth.profile')
  async getProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.users.get();
    return res.success(
      await this.transform(user, new UserDetailTransformer(), { req }),
    );
  }
}
