const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth"); // Middleware para autenticação
const passport = require("passport");
const jwt = require("jsonwebtoken");
const loginLimiter = require("../middlewares/loginLimiter"); // Importa o limitador

// Rota para registro de usuário
router.post("/registro", userController.registrarUsuario);

// Rota para login de usuário com limitador
router.post("/login", loginLimiter, userController.loginUsuario);

// Rota para listar usuários (somente para usuários logados)
router.get("/listar", auth, userController.listarUsuarios);

// Rota para verificar código de TFA
router.post("/verificar-codigo", userController.verificarCodigo);

// Rota para login via Google OAuth
router.get(
  "/login-google",
  (req, res, next) => {
    console.log("Iniciando fluxo de autenticação com o Google...");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Rota de callback após a autenticação com o Google
router.get(
  "/login-google/callback",
  (req, res, next) => {
    console.log("Callback URL acessado:", req.url);
    next();
  },
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log("Usuário autenticado com sucesso, gerando token JWT...");

    // Gera um token JWT
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
      },
      process.env.JWT_SECRET, // Chave secreta do .env
      { expiresIn: "1h" } // Expira em 1 hora
    );

    console.log("Token JWT gerado:", token);

    // Armazena o token no cookie para autenticação futura
    res.cookie("auth_token", token, {
      httpOnly: true, // Protege contra acesso pelo JavaScript no cliente
      secure: false, // Configure como true em produção com HTTPS
      maxAge: 3600000, // Tempo de expiração em milissegundos (1 hora)
    });

    // Redireciona para a página inicial (rota "/")
    res.redirect("/");
  }
);

// Rota para verificar se o usuário está logado
router.get("/usuarios-logados", auth, (req, res) => {
  console.log("Rota /usuarios-logados acessada por:", req.user);
  res.json({
    message: "Usuário logado com sucesso!",
    user: req.user, // O usuário estará disponível no req.user devido ao middleware auth
  });
});

module.exports = router;
