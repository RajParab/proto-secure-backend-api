const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 30,
  skipSuccessfulRequests: false,
});

const otpratelimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 30,
  skipSuccessfulRequests: false,
});

module.exports = {
  authLimiter,
  otpratelimiter,
};
