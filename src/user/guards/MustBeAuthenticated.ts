import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthenticateUser } from './AuthenticateUser';
import { Unauthorized } from '@libs/core';

/**
 * Mandatory Authentication Guard.
 * User must be authorized.
 */
@Injectable()
export class MustBeAuthenticated extends AuthenticateUser {
  /**
   * Perform actions before authentication, if any.
   * @param context
   */
  beforeAuth(context: ExecutionContext): void {
    const request = context.switchToHttp().getRequest();
    const bearer = request.headers['authorization'];
    if (!bearer) throw new Unauthorized();
    return;
  }

  /**
   * Perform actions after authentication, if any.
   * @param user
   */
  afterAuth(user): Record<string, any> {
    if (!user) throw new Unauthorized();
    return { user, pass: true };
  }
}
