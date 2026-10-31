import { applyDecorators } from '@nestjs/common';
import { IsByteLength, IsString, MinLength } from 'class-validator';

/**
 * Rules for a new password (signup, reset). bcrypt ignores everything
 * after the first 72 bytes, so longer passwords are rejected instead of
 * being silently cut.
 */
export function IsPassword(): PropertyDecorator {
  return applyDecorators(
    IsString(),
    MinLength(8),
    IsByteLength(0, 72, { message: '$property must be at most 72 bytes' }),
  );
}
