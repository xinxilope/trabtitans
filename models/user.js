// models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

// Definindo o modelo User
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Garantindo que o email seja único
        validate: {
            isEmail: true,  // Validação para garantir que seja um email válido
        },
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Função para criptografar a senha antes de salvar no banco
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10); // Gera um salt
    user.senha = await bcrypt.hash(user.senha, salt); // Criptografa a senha com o salt
});

// Função para comparar a senha informada com a senha no banco
User.prototype.compararSenha = async function (senhaInformada) {
    return await bcrypt.compare(senhaInformada, this.senha); // Verifica se as senhas coincidem
};

module.exports = User;
