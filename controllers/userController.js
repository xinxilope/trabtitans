// controllers/userController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.registrarUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verifica se o email já está em uso
        const usuarioExistente = await User.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Email já está em uso.' });
        }

        // Cria o novo usuário
        const usuario = await User.create({ email, senha });

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            usuario: {
                id: usuario.id,
                email: usuario.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }
};

exports.loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verifica se o usuário existe
        const usuario = await User.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }

        // Verifica se a senha é válida
        const senhaValida = await usuario.compararSenha(senha);
        if (!senhaValida) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email }, // Dados no payload
            process.env.JWT_SECRET,                  // Chave secreta
            { expiresIn: '1h' }                      // Expiração do token
        );

        res.status(200).json({
            message: 'Login bem-sucedido!',
            token, // Retorna o token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao realizar login.' });
    }
};

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await User.findAll({
            attributes: ['id', 'email'], // Retorna apenas os campos necessários
        });
        res.status(200).json({ usuarios });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao listar usuários.' });
    }
};
