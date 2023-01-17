import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 5, // Limit each IP to 10 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const regConfirmLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 5, // Limit each IP to 10 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const registerUserLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 5, // Limit each IP to 10 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const resendRegEmailLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 5, // Limit each IP to 10 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const passwordRecoveryLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 5, // Limit each IP to 10 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
