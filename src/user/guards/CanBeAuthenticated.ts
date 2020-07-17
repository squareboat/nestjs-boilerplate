import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthenticateUser } from './AuthenticateUser';

/**
 * Optional Authentication Guard.
 * User can be authorized or cannot be.
 */
@Injectable()
export class CanBeAuthenticated extends AuthenticateUser {
  /**
   * Perform actions before authentication, if any.
   * @param context
   */
  beforeAuth(context: ExecutionContext): void {
    const request = context.switchToHttp().getRequest();
    const bearer = request.headers['authorization'];
    if (!bearer) return;
    return;
  }

  /**
   * Perform actions after authentication, if any.
   * @param user
   */
  afterAuth(user): Record<string, any> {
    return { user, pass: true };
  }
}
