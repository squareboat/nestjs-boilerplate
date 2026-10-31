/**
 * Access tokens are signed with JWT_SECRET. Password reset tokens are
 * signed with RESET_PASSWORD_SECRET plus the user's current password
 * hash, so one kind can never be used as the other, and a reset token
 * stops working as soon as the password changes.
 * Every token also carries a `typ` claim that is checked on use.
 */
import { createHmac } from 'node:crypto';

export const ACCESS_TOKEN = 'access';
export const RESET_PASSWORD_TOKEN = 'password_reset';

export function jwtSecret(): string {
  return process.env.JWT_SECRET ?? '';
}

export function resetPasswordSecret(passwordHash: string): string {
  return (process.env.RESET_PASSWORD_SECRET ?? '') + passwordHash;
}

/**
 * A short HMAC of the password hash, stored in access tokens (`pwd`).
 * JwtStrategy compares it with the current hash, so changing the
 * password logs out every token issued before.
 */
export function passwordFingerprint(passwordHash: string): string {
  return createHmac('sha256', jwtSecret())
    .update(passwordHash)
    .digest('base64url')
    .slice(0, 22);
}

/**
 * Throws if the HTTP server must not start with the configured secrets.
 * (Not called for `node cli ...` commands, which never issue tokens.)
 */
export function assertAuthSecrets(): void {
  const jwt = process.env.JWT_SECRET ?? '';
  const reset = process.env.RESET_PASSWORD_SECRET ?? '';
  const problems: string[] = [];
  if (!jwt) problems.push('JWT_SECRET is empty');
  if (!reset) problems.push('RESET_PASSWORD_SECRET is empty');
  if (jwt && jwt === reset) {
    problems.push('JWT_SECRET and RESET_PASSWORD_SECRET are the same');
  }
  if (problems.length) {
    throw new Error(
      `${problems.join(', ')}. Set both in .env to different random values ` +
        '(`node cli init` generates them, or run `openssl rand -base64 32`).',
    );
  }
}
