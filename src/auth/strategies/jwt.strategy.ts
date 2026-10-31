import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN, jwtSecret } from '../secrets';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Read the secret per request instead of at startup, so the app (and
      // `node cli ...` commands such as `init`) can boot before JWT_SECRET is set.
      // Without a secret every token is rejected.
      secretOrKeyProvider: (_req, _token, done) => done(null, jwtSecret()),
    });
  }

  async validate(payload: any) {
    // only access tokens, never a password reset (or any other) token
    if (payload?.typ !== ACCESS_TOKEN) throw new UnauthorizedException();

    // You can add more logic here, e.g., fetch user from DB
    return { userId: payload.sub, username: payload.username };
  }
} 