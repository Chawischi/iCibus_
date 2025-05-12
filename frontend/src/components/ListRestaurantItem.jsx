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
          <RestaurantItem
            key={restaurant.id} 
            name={restaurant.nome}
            category={restaurant.Categoria?.map(c => c.nome).join(", ") || ''}
            image={restaurant.imagem}
            isSelected={restaurant.id === selectedRestaurant}
             onClick={() => handleRestaurantClick(restaurant)}
          />
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
