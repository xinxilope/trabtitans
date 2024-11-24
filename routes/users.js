// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth'); // Middleware para autenticação

// Rota para registro de usuário
router.post('/registro', userController.registrarUsuario);

// Rota para login de usuário
router.post('/login', userController.loginUsuario);

// Rota para listar usuários (somente para usuários logados)
router.get('/listar', auth, userController.listarUsuarios);

module.exports = router;
