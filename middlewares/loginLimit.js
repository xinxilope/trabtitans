const rateLimit = require("express-rate-limit");

// Configuração do limitador para a rota de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message:
      "Você excedeu o limite de tentativas de login. Tente novamente em 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
