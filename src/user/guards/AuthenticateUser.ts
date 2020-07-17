import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../services';

export abstract class AuthenticateUser implements CanActivate {
  constructor(private service: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.beforeAuth(context);

    const request = context.switchToHttp().getRequest();
    const bearer = request.headers['authorization'];

    let authUser = request.user;
    if (!authUser) {
      authUser = await this.service.getByToken(bearer);
    }

    const { pass, user } = this.afterAuth(authUser);
    request.user = user;

    return pass;
  }

  /**
   * Perform actions before authentication, if any.
   * @param context
   */
  abstract beforeAuth(context: ExecutionContext): void;

  /**
   * Perform actions after authentication, if any.
   * @param user
   */
  abstract afterAuth(user): Record<string, any>;
}
