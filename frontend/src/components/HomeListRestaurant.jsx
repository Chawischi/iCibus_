import { useState } from 'react';
import PropTypes from 'prop-types';
import RestaurantItem from './RestaurantItem';
import { useNavigate } from 'react-router-dom';

const HomeListRestaurant = ({ restaurants }) => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const navigate = useNavigate();

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurantId(restaurant.id);
    navigate(`/restaurant/${restaurant.id}`); // 👈 redireciona para a página
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {restaurants.map((restaurant) => (
          <RestaurantItem
            key={restaurant.id}
            name={restaurant.nome}
            category={restaurant.Categoria?.map(c => c.nome).join(', ') || ''}
            image={restaurant.imagem}
            isSelected={restaurant.id === selectedRestaurantId}
            onClick={() => handleRestaurantClick(restaurant)}
          />
        ))}
      </div>
    </div>
  );
};

HomeListRestaurant.propTypes = {
  restaurants: PropTypes.array.isRequired,
  onSelectRestaurant: PropTypes.func,
};

export default HomeListRestaurant;
