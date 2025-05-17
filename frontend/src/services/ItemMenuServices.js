const API_URL = import.meta.env.VITE_API_URL;

export async function getItensMenuByRestauranteId(restauranteId, token) {
  try {
    const response = await fetch(`${API_URL}/itemMenu/item/${restauranteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar itens');
    }

    return { success: true, itensMenu: data }; 
  } catch (error) {
    console.error('Erro na requisição:', error);
    return { success: false, message: error.message };
  }
}



export const createItemMenu = async (formData, token) => {
  const res = await fetch(`${API_URL}/itemMenu`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Erro ao criar item do menu');
  }
  return res.json();
};

export const updateItemMenu = async (id, formData, token) => {
  const res = await fetch(`${API_URL}/itemMenu/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Erro ao atualizar item do menu');
  }
  return res.json();
};

export const deleteItemMenu = async (id, token) => {
  const res = await fetch(`${API_URL}/itemMenu/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Erro ao excluir item do menu');
  }
  return res.json();
};
