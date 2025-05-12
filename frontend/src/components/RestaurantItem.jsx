import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

const RestaurantItem = ({ name, category, image, isSelected, onClick }) => {
  const [isSelectedLocal, setIsSelectedLocal] = useState(isSelected);
  const cardRef = useRef(null);

  // Função para desmarcar quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsSelectedLocal(false); // Desmarcar se o clique foi fora
      }
    };

    // Adicionar o evento de clique fora
    document.addEventListener('mousedown', handleClickOutside);

    // Limpar o evento quando o componente for desmontado
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Função para lidar com o clique no card
  const handleCardClick = () => {
    setIsSelectedLocal(!isSelectedLocal); // Alterna a seleção
    if (onClick) {
      onClick(); // Chama a função de callback (passada como prop)
    }
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
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-200"
        />
      </div>
      <div className="h-1/3 px-2 py-1 flex flex-col justify-center">
        <h3 className="text-sm font-semibold truncate text-center group-hover:text-primary">{name}</h3>
        <p className="text-xs text-gray-500 truncate text-center group-hover:text-primary">{category}</p>
      </div>
    </div>
  );
};

RestaurantItem.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default RestaurantItem;
