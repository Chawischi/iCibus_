const { Cart, CartItem, ItemMenu } = require('../models'); // ajuste o caminho conforme seu projeto

// Pega ou cria o carrinho do usuário
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ where: { userId }, include: [{ model: CartItem, as: 'items', include: ['product'] }] });
  if (!cart) {
    cart = await Cart.create({ userId });
  }
  return cart;
}

// GET /cart - pega carrinho com itens
exports.getCart = async (req, res) => {
  try {
    const userId = req.userId; // alterado aqui
    const cart = await getOrCreateCart(userId);
    return res.json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar carrinho' });
  }
};

// POST /cart/items - adiciona item no carrinho (ou atualiza quantidade se já existir)
exports.addItemToCart = async (req, res) => {
  try {
    const userId = req.userId; // alterado aqui
    const { itemMenuId, quantity } = req.body;
    if (!itemMenuId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'itemMenuId e quantity são obrigatórios e quantity deve ser >= 1' });
    }

    const cart = await getOrCreateCart(userId);

    // Verifica se item já existe no carrinho
    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, itemMenuId } });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ cartId: cart.id, itemMenuId, quantity });
    }

    const updatedCart = await Cart.findByPk(cart.id, { include: [{ model: CartItem, as: 'items', include: ['product'] }] });
    return res.status(201).json(updatedCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao adicionar item no carrinho' });
  }
};

// PUT /cart/items/:itemId - atualiza quantidade do item
exports.updateItemQuantity = async (req, res) => {
  try {
    const userId = req.userId; // alterado aqui
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity é obrigatório e deve ser >= 1' });
    }

    const cart = await getOrCreateCart(userId);

    const cartItem = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });
    if (!cartItem) {
      return res.status(404).json({ error: 'Item não encontrado no carrinho' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const updatedCart = await Cart.findByPk(cart.id, { include: [{ model: CartItem, as: 'items', include: ['product'] }] });
    return res.json(updatedCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar item' });
  }
};

// DELETE /cart/items/:itemId - remove item do carrinho
exports.removeItemFromCart = async (req, res) => {
  try {
    const userId = req.userId; // alterado aqui
    const { itemId } = req.params;

    const cart = await getOrCreateCart(userId);
    const cartItem = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item não encontrado no carrinho' });
    }

    await cartItem.destroy();

    const updatedCart = await Cart.findByPk(cart.id, { include: [{ model: CartItem, as: 'items', include: ['product'] }] });
    return res.json(updatedCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao remover item do carrinho' });
  }
};

// POST /cart/checkout - finalizar compra (aqui só um exemplo, pode adaptar)
exports.checkout = async (req, res) => {
  try {
    const userId = req.userId; // alterado aqui
    const cart = await getOrCreateCart(userId);

    // Aqui você pode implementar a lógica de pedido, pagamento etc.

    // Após finalizar, esvaziar o carrinho:
    await CartItem.destroy({ where: { cartId: cart.id } });

    return res.json({ message: 'Compra finalizada com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao finalizar compra' });
  }
};
