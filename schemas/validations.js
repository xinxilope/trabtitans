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
    .required()
    .messages({
      "string.empty": "O campo senha não pode estar vazio.",
      "string.min": "O campo senha deve ter pelo menos 3 caracteres.",
      "string.max": "O campo senha deve ter no máximo 15 caracteres.",
      "string.pattern.base":
        "O campo senha deve conter pelo menos um número e um caractere especial.",
      "any.required": "O campo senha é obrigatório.",
    }),
});

module.exports = {
  userSchema,
};
