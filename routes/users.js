const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { userSchema } = require("../schemas/validations"); // Importa o schema de validação

// Rotas
router.post(
  "/registro",
  validate(userSchema), // Middleware de validação
  userController.registrarUsuario
);

router.post(
  "/login",
  validate(userSchema), // Middleware de validação
  userController.loginUsuario
);

router.get("/listar", auth, userController.listarUsuarios);

router.post("/verificar-codigo", userController.verificarCodigo);

module.exports = router;
