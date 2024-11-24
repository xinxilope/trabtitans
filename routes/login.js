const express = require("express");
const passport = require("passport");
const router = express.Router();

// Inicia o fluxo OAuth2 com o Google
router.get(
  "/login-google", // Deve corresponder à rota configurada
  passport.authenticate("google", {
    scope: ["profile", "email"], // Solicita perfil e email
  })
);

// Callback do Google após autenticação
router.get(
  "/login-google", // Callback deve coincidir com o registrado no Google Cloud Console
  passport.authenticate("google", {
    failureRedirect: "/login", // Redireciona em caso de falha
  }),
  (req, res) => {
    res.redirect("/users/dashboard"); // Exemplo de redirecionamento
  }
);

module.exports = router;
