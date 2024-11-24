// routes/users.js
var express = require('express');
var router = express.Router();
const User = require('../models/user'); // Certifique-se de que o caminho está correto para o seu arquivo user.js
const bcrypt = require('bcryptjs');

// Rota de Registro
router.post('/registro', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verifica se o email já está em uso
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Email já está em uso.' });
    }

    // Criação do novo usuário
    const usuario = await User.create({ email, senha });
    res.status(201).json({ message: 'Usuário registrado com sucesso!', usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verifica se o usuário existe
    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ message: 'Email ou senha inválidos.' });
    }

    // Verifica se a senha informada corresponde com a senha armazenada
    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      return res.status(400).json({ message: 'Email ou senha inválidos.' });
    }

    // Login bem-sucedido
    res.status(200).json({ message: 'Login bem-sucedido!', usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao realizar login.' });
  }
});

module.exports = router;
