import PropTypes from 'prop-types';
import RestaurantItem from './RestaurantItem';
import { useState } from 'react';

const ListRestaurantItem = ({ restaurantes, onSelectRestaurant }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant.id);
    if (onSelectRestaurant) {
      onSelectRestaurant(restaurant);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {restaurantes.map((restaurant) => (
          <div
            key={restaurant.id}
            onClick={() => handleRestaurantClick(restaurant)}
            className={`cursor-pointer ${selectedRestaurant === restaurant.id ? 'border-2 border-yellow-500' : ''}`} // Adiciona borda amarela quando selecionado
          >
            <RestaurantItem
              name={restaurant.nome}
              category={restaurant.categoria}
              image={`${import.meta.env.VITE_API_URL}/uploads/${restaurant.imagem}`}
              rating={restaurant.avaliacao}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

ListRestaurantItem.propTypes = {
  restaurantes: PropTypes.array.isRequired,
  onSelectRestaurant: PropTypes.func,
};

export default ListRestaurantItem;
