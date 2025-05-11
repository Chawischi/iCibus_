import React from 'react';

const LancheDetailModal = ({ item, onClose, onAddToCart }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl text-gray-500">
          &times;
        </button>
        <div className="text-center">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-40 object-cover rounded-md"
          />
          <h2 className="text-2xl font-semibold mt-4">{item.name}</h2>
          <p className="mt-2 text-lg text-gray-700">{item.description}</p>
          <p className="mt-2 text-xl font-bold">R$ {item.price}</p>

          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={onAddToCart}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Adicionar ao Carrinho
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LancheDetailModal;
