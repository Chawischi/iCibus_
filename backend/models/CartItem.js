const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    itemMenuId: { // referência ao produto do cardápio
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  }, {
    tableName: 'cart_items',
    timestamps: true,
  });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });
    CartItem.belongsTo(models.ItemMenu, { foreignKey: 'itemMenuId', as: 'product' }); // ajustar ItemMenu se seu model tiver outro nome
  };

  return CartItem;
};
