// routes/index.js
var express = require('express');
var router = express.Router();
const auth = require('../middlewares/auth'); // Importa o middleware de autenticação

/* GET home page. */
router.get('/', auth, function (req, res, next) {
  res.render('index', { title: 'Bem-vindo, usuário logado!' });
});

module.exports = router;
