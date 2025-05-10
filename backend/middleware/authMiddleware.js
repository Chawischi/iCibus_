const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se tem token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // guarda o ID do usuário na requisição
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = authMiddleware;
