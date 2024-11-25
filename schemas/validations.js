const Joi = require("joi");

const userSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "O campo email não pode estar vazio.",
      "string.email": "O campo email deve ser um endereço de e-mail válido.",
      "any.required": "O campo email é obrigatório.",
    }),
  senha: Joi.string()
    .min(3)
    .max(15)
    .pattern(/(?=.*\d)(?=.*[!@#$%^&*])/)
    .allow(null, "") // Permitir que a senha seja null ou vazia para login via Google
    .messages({
      "string.min": "O campo senha deve ter pelo menos 3 caracteres.",
      "string.max": "O campo senha deve ter no máximo 15 caracteres.",
      "string.pattern.base":
        "O campo senha deve conter pelo menos um número e um caractere especial.",
    }),
});

const googleLoginSchema = Joi.object({
  googleId: Joi.string().required().messages({
    "string.empty": "O campo googleId não pode estar vazio.",
    "any.required":
      "O campo googleId é obrigatório para autenticação via Google.",
  }),
});

module.exports = {
  userSchema,
  googleLoginSchema, // Adicionado para validação de login via Google
};
