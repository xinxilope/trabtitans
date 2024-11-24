// config/db.js
require('dotenv').config();  // Carrega as variáveis do .env

const { Sequelize } = require('sequelize');

// Usando as variáveis de ambiente para a configuração do Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,    // Nome do banco de dados
    process.env.DB_USER,    // Usuário do banco
    process.env.DB_PASSWORD, // Senha do banco
    {
        host: process.env.DB_HOST,  // Endereço do host (localhost, etc)
        dialect: process.env.DB_DIALECT, // Tipo de banco de dados (postgres, mysql, etc)
        logging: false, // Desabilita o log no console (pode ser habilitado para debug)
    }
);

module.exports = sequelize;
