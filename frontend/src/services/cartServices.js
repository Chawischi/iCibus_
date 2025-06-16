// src/services/cartServices.js

export const addItemToCart = async (itemMenuId, quantity, token) => {
  if (!token) throw new Error('Token não fornecido.');

  const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ itemMenuId, quantity }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao adicionar item ao carrinho');
  }

  return await res.json();
};

export const checkoutCart = async (token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/checkout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Erro ao finalizar compra');
  }

  return await res.json();
};

export const fetchCartData = async (token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Erro ao buscar carrinho');

  return await res.json();
};

export const updateCartItemQuantity = async (itemId, quantity, token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) throw new Error('Erro ao atualizar quantidade do item');

  return await res.json();
};

export const removeCartItem = async (itemId, token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Erro ao remover item do carrinho');

  return await res.json();
};
