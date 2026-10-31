import { IsNotEmpty, IsString } from 'class-validator';
import { IsPassword } from './password';

export class RequestPasswordResetDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsPassword()
  password: string;
}
