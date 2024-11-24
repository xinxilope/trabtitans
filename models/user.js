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
        allowNull: false,
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

User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(user.senha, salt);
});

User.prototype.compararSenha = async function (senhaInformada) {
    return bcrypt.compare(senhaInformada, this.senha);
};

module.exports = User;
