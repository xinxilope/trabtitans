const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sequelize = require("./config/db"); // Banco de dados
const session = require("express-session"); // Middleware de sessão
const passport = require("./middlewares/passport"); // Middleware do Passport
require("dotenv").config(); // Para carregar variáveis do .env

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users"); // Rotas de usuários
const loginRouter = require("./routes/login"); // Rotas de autenticação OAuth2
const createError = require("http-errors");

const app = express();

// Banco de dados: sincronização
sequelize
  .sync()
  .then(() => console.log("Banco de dados sincronizado!"))
  .catch((err) => console.error("Erro ao sincronizar o banco de dados:", err));

// Configuração de visualização
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configuração da sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET || "chave-padrao-segura", // Use uma chave segura no .env
    resave: false, // Não salva sessões se não forem alteradas
    saveUninitialized: false, // Não cria sessões até que algo seja armazenado
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hora de duração
      httpOnly: true, // Evita acesso ao cookie via JavaScript do cliente
      secure: false, // Configure como `true` em produção com HTTPS
    },
  })
);

// Inicializa o Passport
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.use("/", indexRouter);
app.use("/users", loginRouter); // Mantém o loginRouter no prefixo /users

// Tratamento de erro 404
app.use((req, res, next) => {
  next(createError(404));
});

// Tratamento de erros
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
