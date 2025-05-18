import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '@app/user';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { mailService } from './services/mail.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,

  ],
  providers: [AuthService,JwtStrategy,mailService],
  controllers: [AuthController],
  exports: [AuthService ],
})
export class AuthModule {}
