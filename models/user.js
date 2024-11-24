// models/user.js
const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: true, // Permitir null para usuários OAuth
  },
  googleId: {
    type: DataTypes.STRING, // ID fornecido pelo Google OAuth2
    allowNull: true,
  },
  nome: {
    type: DataTypes.STRING, // Nome completo do usuário
    allowNull: true,
  },
  tfaCode: {
    type: DataTypes.STRING, // Código temporário para TFA
    allowNull: true,
  },
  tfaExpires: {
    type: DataTypes.DATE, // Expiração do código TFA
    allowNull: true,
  },
});

// Hash da senha antes de salvar (apenas se senha for fornecida)
User.beforeCreate(async (user) => {
  if (user.senha) {
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(user.senha, salt);
  }
});

// Método para comparar senhas
User.prototype.compararSenha = async function (senhaInformada) {
  return bcrypt.compare(senhaInformada, this.senha);
};

module.exports = User;
