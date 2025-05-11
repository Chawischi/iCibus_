import React from 'react';

const RestaurantDetailCard = ({ restaurant }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold">{restaurant.name}</h2>
        <p className="text-lg text-gray-700 mt-2">{restaurant.category}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-medium">Sobre Nós</h3>
        <p className="text-gray-700">{restaurant.about}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-medium">Endereço</h3>
        <p className="text-gray-700">{restaurant.address}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-medium">Telefone</h3>
        <p className="text-gray-700">{restaurant.phone}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-medium">Horário de Funcionamento</h3>
        <p className="text-gray-700">{restaurant.hours}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-4">Lanches</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {restaurant.items.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200 transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover rounded-md"
              />
              <h4 className="mt-2 font-medium">{item.name}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="mt-2 text-lg font-bold">R$ {item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailCard;
