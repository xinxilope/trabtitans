// controllers/userController.js
const User = require('../models/user'); // Modelo User

/**
 * Registro de um novo usuário
 */
const registrarUsuario = async (req, res) => {
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
};

/**
 * Login de um usuário existente
 */
const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verifica se o usuário existe
        const usuario = await User.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }

        // Verifica se a senha está correta
        const senhaValida = await usuario.compararSenha(senha);
        if (!senhaValida) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }

        res.status(200).json({ message: 'Login bem-sucedido!', usuario });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao realizar login.' });
    }
};

module.exports = { registrarUsuario, loginUsuario };
