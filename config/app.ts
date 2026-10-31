import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'NestJS App',
  env: process.env.APP_ENV || 'local',
  debug: +process.env.APP_DEBUG || 1,
  url: process.env.APP_URL || 'localhost',
  port: +process.env.APP_PORT || 5000,

  // Browser origins that may call the API, comma separated
  // (e.g. "http://localhost:3000,https://app.example.com"), or "*".
  // Empty: no CORS headers, so browsers block cross-origin calls.
  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  // Express "trust proxy" (e.g. "1" behind one load balancer). Needed for
  // the client IP, which the auth rate limit counts per. Empty: off.
  trustProxy: process.env.APP_TRUST_PROXY || '',

  // requests per IP to each of login, signup and the two password reset
  // routes, per window
  authRateLimit: {
    limit: +process.env.AUTH_RATE_LIMIT_MAX || 10,
    windowMs: (+process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES || 15) * 60 * 1000,
  },
}));
