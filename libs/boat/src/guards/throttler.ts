import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppConfig } from '../utils';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  async handleRequest({context, limit, ttl}) {
    const req = context.switchToHttp().getRequest();

    const allowedKeys = AppConfig.get('app.apiKeys');
    const key = req.headers['x-api-key'];

    // skipping rate limit for allowed clients
    if (allowedKeys.includes(key)) return true;

    return super.handleRequest({context, limit, ttl, throttler: this.throttlers[0], blockDuration: 0, getTracker: this.commonOptions.getTracker, generateKey: this.commonOptions.generateKey});
  }
}
