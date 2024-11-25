const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const createError = require("http-errors");
const sequelize = require("./config/db"); // Banco de dados
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users"); // Rotas de usuários
const passportConfig = require("./config/passport"); // Configuração do Passport

const app = express();

const middlewares = require("./middlewares");

// Configuração do Passport
passportConfig();

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
app.use(middlewares.cors);
app.use(middlewares.helmet());
app.use(middlewares.rateLimit);

// Configuração de sessão para o Passport
app.use(
  session({
    secret: "secreto", // Recomendação: use uma variável de ambiente para maior segurança
    resave: false,
    saveUninitialized: true,
  })
);

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Tratamento de erro 404
app.use((req, res, next) => {
  next(createError(404));
});

// Tratamento de erros
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  console.error("Deu Bosta", err);
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
