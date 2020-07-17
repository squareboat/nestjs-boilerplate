import { ApiController, Request, Response } from '@app/core';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { UserService } from '../services';

@Controller('users')
export class UserController extends ApiController {
  constructor(private users: UserService) {
    super();
  }

  @Get('/profile')
  async getProfile(
    @Req() _req: Request,
    @Res() _res: Response,
  ): Promise<Response> {
    const user = await this.users.getProfile(_req.all());
    return _res.success(user);
  }
}
