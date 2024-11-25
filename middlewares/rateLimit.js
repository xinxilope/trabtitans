const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    message:
      "Você excedeu o limite de requisições. Tente novamente mais tarde.",
  },
  headers: true,
});

module.exports = limiter;
