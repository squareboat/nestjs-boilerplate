import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { UserModule } from '@app/user';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { mailService } from './services/mail.service';
import { jwtSecret } from './secrets';
import { authRateLimit } from './rate-limit';

@Module({
  imports: [
    UserModule,
    // a factory, so the secret is read after .env has been loaded
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: jwtSecret(),
        // one algorithm only, for signing and for verifying (reset tokens)
        signOptions: { expiresIn: '1h', algorithm: 'HS256' },
        verifyOptions: { algorithms: ['HS256'] },
      }),
    }),
    PassportModule,

  ],
  providers: [AuthService,JwtStrategy,mailService],
  controllers: [AuthController],
  exports: [AuthService ],
})
export class AuthModule implements NestModule {
  constructor(private config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const options = this.config.get('app.authRateLimit');
    // a separate counter per route
    for (const route of ['login', 'signup', 'request-password-reset', 'reset-password']) {
      consumer
        .apply(authRateLimit(options))
        .forRoutes({ path: `api/auth/${route}`, method: RequestMethod.POST });
    }
  }
}
