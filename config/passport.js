const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); // Modelo do usuário

module.exports = function () {
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/users/login-google/callback'
        },
        async (token, tokenSecret, profile, done) => {
            try {
                // Verifica se o usuário já existe no banco de dados
                let user = await User.findOne({ where: { googleId: profile.id } });
                if (!user) {
                    // Se não existe, cria um novo usuário
                    user = await User.create({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                    });
                }

                return done(null, user); // Usuário autenticado
            } catch (err) {
                return done(err, false); // Erro no processo de login
            }
        }
    ));

    // Serializa o usuário para a sessão
    passport.serializeUser((user, done) => {
        done(null, user.id); // Serializa o id do usuário
    });

    // Desserializa o usuário a partir da sessão
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
