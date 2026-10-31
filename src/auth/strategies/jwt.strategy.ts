import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@app/user';
import { ACCESS_TOKEN, jwtSecret, passwordFingerprint } from '../secrets';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private users: UserService) {
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

    // the user must still exist and have the password the token was issued for
    const user = await this.users.findById(payload.sub);
    if (!user || payload.pwd !== passwordFingerprint(user.password)) {
      throw new UnauthorizedException();
    }

    return { userId: user.id, username: user.username };
  }
} 