const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Valida formato de email
const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Gera JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// ============================
// Registro de novo usuário
// ============================
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Valida email
    if (!isEmailValid(email)) {
      return res.status(400).json({ message: 'Email inválido.' });
    }

    // Verifica duplicidade
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    // Criptografa senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Verifica se é o primeiro usuário
    const userCount = await User.count();
    const role = userCount === 0 ? 'admin' : 'user'; // Primeiro usuário será admin, o resto será user

    // Cria usuário
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role, // Atribui o role como admin ou user
    });

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role, // Retorna o role do usuário
      },
    });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// ============================
// Login de usuário
// ============================
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // Verifica senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Gera token
    const token = generateToken(user.id);

    return res.status(200).json({
      message: 'Login bem-sucedido!',
      user: {
        id: user.id,
        email: user.email,
        role: user.role, // Retorna o role do usuário
      },
      token,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = {
  register,
  login,
};
