import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

const ItemMenuItem = ({ nome, preco, image, isSelected, onClick }) => {
  const [isSelectedLocal, setIsSelectedLocal] = useState(isSelected);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsSelectedLocal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCardClick = () => {
    setIsSelectedLocal(!isSelectedLocal);
    if (onClick) onClick();
  };

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-xl shadow-md overflow-hidden w-48 h-48 flex flex-col
        cursor-pointer transition-all duration-200
        ${isSelectedLocal ? 'border-4 border-yellow-500 bg-yellow-50' : 'border-2 border-red-500 hover:border-yellow-400 hover:bg-orange-50'}
        group`}
      onClick={handleCardClick}
    >
      <div className="w-full h-2/3">
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/${image}`}
          alt={nome}
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-200"
        />
      </div>
      <div className="h-1/3 px-2 py-1 flex flex-col justify-center">
        <h3 className="text-sm font-semibold truncate text-center group-hover:text-primary">{nome}</h3>
        <p className="text-xs text-gray-500 truncate text-center group-hover:text-primary">R$ {Number(preco).toFixed(2)}</p>
      </div>
    </div>
  );
};

ItemMenuItem.propTypes = {
  nome: PropTypes.string.isRequired,
  preco: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default ItemMenuItem;
