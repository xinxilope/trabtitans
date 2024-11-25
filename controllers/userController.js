// controllers/userController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { enviarCodigo } = require('../utils/emailService');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto'); // Para gerar o código

// Instancia o cliente OAuth2 do Google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
        const usuario = await User.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).json({ message: "Email ou senha inválidos." });
        }

        // Verifica se a conta está bloqueada
        if (usuario.isBlocked) {
            const umaHoraAtras = new Date(Date.now() - 60 * 60 * 1000); // 1 hora atrás
            if (usuario.lastFailedAttempt > umaHoraAtras) {
                return res
                    .status(403)
                    .json({ message: "Conta bloqueada. Tente novamente mais tarde." });
            }

            // Desbloqueia o usuário após 1 hora
            usuario.isBlocked = false;
            usuario.failedAttempts = 0;
            usuario.lastFailedAttempt = null;
            await usuario.save();
        }

        // Verifica a senha
        const senhaValida = await usuario.compararSenha(senha);
        if (!senhaValida) {
            // Incrementa tentativas falhas
            usuario.failedAttempts += 1;
            usuario.lastFailedAttempt = new Date();

            // Bloqueia o usuário se ultrapassar o limite de 5 tentativas
            if (usuario.failedAttempts >= 5) {
                usuario.isBlocked = true;
            }

            await usuario.save();
            return res.status(400).json({
                message: "Email ou senha inválidos.",
                remainingAttempts: Math.max(0, 5 - usuario.failedAttempts),
            });
        }

        // Reseta as tentativas falhas após login bem-sucedido
        usuario.failedAttempts = 0;
        usuario.lastFailedAttempt = null;
        await usuario.save();

        // Gerar código de verificação
        const codigoTFA = crypto.randomInt(100000, 999999).toString();
        const expiraEm = new Date(Date.now() + 5 * 60 * 1000); // Expira em 5 minutos

        usuario.tfaCode = codigoTFA;
        usuario.tfaExpires = expiraEm;
        await usuario.save();

        // Enviar o código por e-mail
        await enviarCodigo(usuario.email, codigoTFA);

        res
            .status(200)
            .json({ message: "Código de verificação enviado ao seu e-mail." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao realizar login." });
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

exports.verificarCodigo = async (req, res) => {
    const { email, codigo } = req.body;

    try {
        const usuario = await User.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }

        // Verificar se o código é válido
        if (usuario.tfaCode !== codigo || new Date() > usuario.tfaExpires) {
            return res.status(400).json({ message: 'Código inválido ou expirado.' });
        }

        // Gera um token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Limpa o código TFA após o uso
        usuario.tfaCode = null;
        usuario.tfaExpires = null;
        await usuario.save();

        res.status(200).json({
            message: 'Login concluído com sucesso!',
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao verificar código.' });
    }
};
