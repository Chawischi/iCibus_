// restaurantServices.js

export const createRestaurante = async (formData, token) => {
  if (!token) {
    console.error('Token de autenticação ausente.');
    throw new Error('Token de autenticação ausente.');
  }

  try {

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }


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
/*
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
*/

export const getRestaurants = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurantes`, {
      method: 'GET',
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

export const saveRestaurante = async (id, formData, token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurantes/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar restaurante: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro em saveRestaurante:', error);
    throw error;
  }
};

export const deleteRestaurante = async (id, token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurantes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar restaurante: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro em deleteRestaurante:', error);
    throw error;
  }
};
/*
export const getRestaurantsByCategory = async (categoryId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token de autenticação ausente.');
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurantes/categoria/${categoryId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao buscar restaurantes por categoria');
    }

    const data = await response.json();
    return data.restaurantes;  // Retorna array de restaurantes
  } catch (error) {
    console.error('Erro ao buscar restaurantes por categoria:', error);
    throw error;
  }
};
*/

export const getRestaurantsByCategory = async (categoryId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurantes/categoria/${categoryId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao buscar restaurantes por categoria');
    }

    const data = await response.json();
    return data.restaurantes;
  } catch (error) {
    console.error('Erro ao buscar restaurantes por categoria:', error);
    throw error;
  }
};
/*
export const getRestaurantById = async (id, token) => {
  if (!token) {
    throw new Error('Token de autenticação ausente.');
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurantes/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao buscar restaurante por ID');
    }

    const data = await response.json();
    return data; // Supondo que já retorna os dados completos, incluindo categorias e itens
  } catch (error) {
    console.error('Erro ao buscar restaurante por ID:', error);
    throw error;
  }
};*/

export const getRestaurantById = async (id) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurantes/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao buscar restaurante por ID');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar restaurante por ID:', error);
    throw error;
  }
};

