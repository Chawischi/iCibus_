import React from 'react';

const CategoryItem = ({ image, name, isSelected, onClick }) => {
  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 border-2 rounded-xl min-w-28
        cursor-pointer group transition-all duration-200
        ${isSelected ? 'border-yellow-500 bg-yellow-50 text-primary' : 'border-red-500 hover:border-yellow-400 hover:bg-orange-50'}
        `}
      onClick={onClick}
    >
      <img
        src={image}
        alt={name}
        width={40}
        height={40}
        className="group-hover:scale-125 transition-all duration-200"
      />
      <h2 className="text-sm font-medium group-hover:text-primary">{name}</h2>
    </div>
  );
};

export default CategoryItem;
