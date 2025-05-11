import React from 'react';

const RestaurantCard = ({ name, category, image, rating }) => {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border-2 border-gray-300">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600">{category}</p>
        <div className="flex items-center mt-2">
          <span className="text-yellow-500">★</span>
          <span className="ml-1 text-sm font-medium">{rating}/5</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
