// models/user.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Criptografa a senha antes de criar o usuário
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(user.senha, salt);
});

// Metodo para comparar senhas
User.prototype.compararSenha = async function (senhaInformada) {
    return await bcrypt.compare(senhaInformada, this.senha);
};

module.exports = User;
