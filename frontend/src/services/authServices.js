// Função para registrar um novo usuário
const registerUser = async (email, password) => {
const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Usuário cadastrado com sucesso:', data);
    return data; // Aqui você pode manipular a resposta, se necessário
  } else {
    console.error('Erro no cadastro:', data.message);
    return null; // Aqui você pode retornar o erro para mostrar ao usuário
  }
};

// Função para fazer login de um usuário
const loginUser = async (email, password) => {
const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Login bem-sucedido:', data);
    // Armazenar o token no localStorage
    localStorage.setItem('token', data.token);
    return data;
  } else {
    console.error('Erro no login:', data.message);
    return null; // Aqui você pode retornar o erro para mostrar ao usuário
  }
};


// Função para obter o token armazenado
const getToken = () => {
  return localStorage.getItem('token');
};

// Função para acessar uma rota protegida
const fetchUserData = async () => {
  const token = getToken();
  if (!token) {
    console.log('Token não encontrado');
    return;
  }

const response = await fetch(`${import.meta.env.VITE_API_URL}/protected`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Enviar o token no cabeçalho Authorization
    },
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Dados do usuário:', data);
    return data;
  } else {
    console.error('Erro ao buscar dados:', data.message);
    return null;
  }
};


export { registerUser, loginUser, getToken, fetchUserData };