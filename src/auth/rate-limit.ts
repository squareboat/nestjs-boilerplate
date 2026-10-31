import { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';

/**
 * Limits how often one IP can call a route (login, signup, password
 * reset). Counts are kept in memory, per process: with several instances
 * or cluster mode use a shared store (see express-rate-limit's stores).
 */
export function authRateLimit(options: {
  limit: number;
  windowMs: number;
}): RequestHandler {
  return rateLimit({
    ...options,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      success: false,
      code: 429,
      message: 'Too many requests, please try again later',
    },
  });
}
