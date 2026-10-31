import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '@app/user';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { mailService } from './services/mail.service';
import { jwtSecret } from './secrets';

@Module({
  imports: [
    UserModule,
    // a factory, so the secret is read after .env has been loaded
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: jwtSecret(),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    PassportModule,

  ],
  providers: [AuthService,JwtStrategy,mailService],
  controllers: [AuthController],
  exports: [AuthService ],
})
export class AuthModule {}
