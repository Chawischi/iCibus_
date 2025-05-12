const createCategory = async (nome, imagem, token) => {
  const formData = new FormData();
  formData.append("nome", nome);
  formData.append("imagem", imagem);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/categorias`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Erro ao criar categoria." };
    }
  } catch (err) {
    console.error(err);
    return { success: false, message: "Erro ao criar categoria." };
  }
};

const getCategories = async (token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/categorias`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, categories: data };
    } else {
      return { success: false, message: 'Erro ao buscar categorias.' };
    }
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Erro ao buscar categorias.' };
  }
};

 const deleteCategory = async (id, token) => {
  if (typeof id !== 'string') {
    console.error("ID inválido:", id); // Adicionando validação para garantir que o ID seja uma string
    return { success: false, message: "ID inválido" };
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/categorias/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao excluir categoria.");
    }

    return { success: true };
  } catch (err) {
    console.error("Erro no serviço de exclusão de categoria:", err);
    return { success: false, message: err.message || "Erro desconhecido ao excluir categoria." };
  }
};
export { 
  getCategories,
  deleteCategory,
  createCategory
 };



