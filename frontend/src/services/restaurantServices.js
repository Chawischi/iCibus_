// restaurantServices.js

export const createRestaurante = async (formData) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token de autenticação ausente.');
    throw new Error('Token de autenticação ausente.');
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurantes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao criar restaurante:", errorData);
      throw new Error(errorData.message || 'Falha ao criar restaurante');
    }

    const data = await response.json();
    console.log("Restaurante criado com sucesso:", data);
    return data;
  } catch (err) {
    console.error("Erro ao criar restaurante:", err);
    throw new Error(err.message || 'Erro ao criar restaurante');
  }
};


export const getRestaurants = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token de autenticação ausente.');
    throw new Error('Token de autenticação ausente.');
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurantes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao buscar restaurantes:", errorData);
      throw new Error(errorData.message || 'Falha ao buscar restaurantes');
    }

    const data = await response.json();
    console.log("Dados de restaurantes recebidos:", data);
    return data;
  } catch (err) {
    console.error("Erro ao buscar restaurantes:", err);
    throw new Error(err.message || 'Erro ao buscar restaurantes');
  }
};
