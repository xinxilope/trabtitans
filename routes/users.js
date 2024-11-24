// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth'); // Middleware para autenticação
const passport = require('passport');

// Rota para registro de usuário
router.post('/registro', userController.registrarUsuario);

// Rota para login de usuário
router.post('/login', userController.loginUsuario);

// Rota para listar usuários (somente para usuários logados)
router.get('/listar', auth, userController.listarUsuarios);

// Rota para verificar código de TFA
router.post('/verificar-codigo', userController.verificarCodigo);

// Rota para login via Google OAuth
router.get('/login-google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Rota de callback após a autenticação com o Google
router.get('/login-google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Após o login com o Google, redireciona o usuário com o token JWT ou sessão
        res.redirect('/users/usuarios-logados');
    }
);

router.get('/usuarios-logados', auth, (req, res) => {
    res.json({
        message: 'Usuário logado com sucesso!',
        user: req.user, // O usuário estará disponível no req.user devido à autenticação com o Google
    });
});


module.exports = router;
