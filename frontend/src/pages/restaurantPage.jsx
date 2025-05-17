import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById } from '../services/restaurantServices';
import DetailsRestaurant from '../components/DetailsRestaurant';
import HomeListItemMenu from '../components/DetailsListItemMenu';
import { getItensMenuByRestauranteId } from '../services/ItemMenuServices';

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getRestaurantById(id, token);
        console.log('restaurant response:', response);

        const data = response.restaurante || response.restaurant || response.data || response;
        setRestaurant(data);
      } catch (err) {
        console.error('Erro ao buscar dados do restaurante:', err);
        setError('Erro ao buscar dados do restaurante');
      }
    };

    fetchRestaurant();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!restaurant || !restaurant.nome) return <p>Carregando restaurante...</p>;

  return (
    <div className="flex min-h-screen max-w-6xl mx-auto p-4 gap-6">
      <DetailsRestaurant restaurant={restaurant} />

      <div className="flex-1">
        <h2 className="text-2xl font-semibold mt-6 mb-3">Itens do Menu</h2>

        <HomeListItemMenu
          restauranteId={restaurant.id}
          fetchItemsFunc={getItensMenuByRestauranteId}
          onSelectItem={(item) => console.log('Item selecionado:', item)}
        />
      </div>
    </div>
  );
};

export default RestaurantPage;
