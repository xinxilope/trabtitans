const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Recupera o token do cookie ou do cabeçalho Authorization
  const token =
    req.cookies?.auth_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token não fornecido." });
  }

  try {
    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET deve estar no .env
    req.user = decoded; // Armazena os dados do token no objeto req
    next(); // Continua para o próximo middleware ou controlador
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    res.status(401).json({ message: "Token inválido." });
  }
};
