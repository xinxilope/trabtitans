// middlewares/passport.js

const passport = require("passport"); // Certifique-se de importar o Passport corretamente
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user"); // Modelo de usuário

// Configuração do Google OAuth2
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Configurar no arquivo .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Configurar no arquivo .env
      callbackURL: "http://localhost:3000/users/login-google", // URL de callback alinhada
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Procura o usuário pelo Google ID
        let user = await User.findOne({ where: { googleId: profile.id } });

        // Se o usuário não existir, cria um novo
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            nome: profile.displayName,
          });
        }

        // Retorna o usuário
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialização do usuário para sessão
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Desserialização do usuário da sessão
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
