// models/user.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  senha: {
    type: DataTypes.STRING,
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
  googleId: {
    type: DataTypes.STRING, // ID único do Google
    allowNull: true, // Não obrigatório se o usuário registrar com e-mail/senha
  },
  name: {
    type: DataTypes.STRING, // Nome do usuário
    allowNull: true, // Também não obrigatório para usuários sem login via Google
  },
});

// Função de criptografia para senha
User.beforeCreate(async (user) => {
  if (user.senha) {
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(user.senha, salt);
  }
});

// Método para comparar a senha fornecida com a armazenada
User.prototype.compararSenha = async function (senhaInformada) {
  return bcrypt.compare(senhaInformada, this.senha);
};

module.exports = User;
