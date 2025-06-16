const API_URL = import.meta.env.VITE_API_URL;

export async function getCart(token) {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro ao buscar carrinho');
    return { success: true, cart: data };
  } catch (error) {
    console.error('Erro na requisição getCart:', error);
    return { success: false, message: error.message };
  }
}

export async function addItemToCart(itemMenuId, quantity, token) {
  try {
    const response = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemMenuId, quantity }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro ao adicionar item ao carrinho');
    return { success: true, cart: data };
  } catch (error) {
    console.error('Erro na requisição addItemToCart:', error);
    return { success: false, message: error.message };
  }
}

export async function updateItemQuantity(itemId, quantity, token) {
  try {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro ao atualizar quantidade do item');
    return { success: true, cart: data };
  } catch (error) {
    console.error('Erro na requisição updateItemQuantity:', error);
    return { success: false, message: error.message };
  }
}

export async function removeItemFromCart(itemId, token) {
  try {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro ao remover item do carrinho');
    return { success: true, cart: data };
  } catch (error) {
    console.error('Erro na requisição removeItemFromCart:', error);
    return { success: false, message: error.message };
  }
}

export async function checkout(token) {
  try {
    const response = await fetch(`${API_URL}/cart/checkout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro ao finalizar compra');
    return { success: true, message: data.message };
  } catch (error) {
    console.error('Erro na requisição checkout:', error);
    return { success: false, message: error.message };
  }
}
