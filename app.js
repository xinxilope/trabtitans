// app.js
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./config/db');  // Importando a configuração de banco de dados
const User = require('./models/user');  // Importando o modelo User

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users'); // Importando a rota de usuários

var app = express();

// Sincronizando o banco de dados e criando a tabela, se não existir
sequelize.sync()
    .then(() => {
        console.log('Banco de dados sincronizado com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/', indexRouter);
app.use('/users', usersRouter); // Usando a rota de usuários

// Tratamento de 404 (Rota não encontrada)
app.use(function(req, res, next) {
    next(createError(404));
});

// Tratamento de erros
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
