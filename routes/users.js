// routes/users.js
const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario } = require('../controllers/userController'); // Importando o controlador

// Rota de Registro
router.post('/registro', registrarUsuario);

// Rota de Login
router.post('/login', loginUsuario);

module.exports = router;
