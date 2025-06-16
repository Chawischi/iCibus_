/*import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById } from '../services/restaurantServices';
import DetailsRestaurant from '../components/DetailsRestaurant';
import HomeListItemMenu from '../components/DetailsListItemMenu';
import { getItensMenuByRestauranteId } from '../services/ItemMenuServices';
import ModalProduto from '../components/ModalProduto';

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getRestaurantById(id, token);
        const data = response.restaurante || response.restaurant || response.data || response;
        setRestaurant(data);
      } catch (err) {
                console.error('Erro ao carregar categorias:', err);
        setError('Erro ao buscar dados do restaurante');
      }
    };
    fetchRestaurant();
  }, [id]);

  // Função para adicionar item ao carrinho
  const handleAddToCart = async (itemMenuId, quantity) => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemMenuId, quantity }),
    });

    if (!res.ok) {
      throw new Error('Falha ao adicionar item ao carrinho');
    }
  };

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
          onSelectItem={(item) => setItemSelecionado(item)}
        />
      </div>

      {itemSelecionado && (
        <ModalProduto
          item={itemSelecionado}
          onClose={() => setItemSelecionado(null)}
          onAddToCart={handleAddToCart}  // <-- Passa a função para o modal aqui
        />
      )}
    </div>
  );
};

export default RestaurantPage;
*/
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById } from '../services/restaurantServices';
import DetailsRestaurant from '../components/DetailsRestaurant';
import HomeListItemMenu from '../components/DetailsListItemMenu';
import ModalProduto from '../components/ModalProduto';
import { getItensMenuByRestauranteId } from '../services/ItemMenuServices';

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getRestaurantById(id, token);
        const data = response.restaurante || response.restaurant || response.data || response;
        setRestaurant(data);
      } catch (err) {
        console.error('Erro ao carregar restaurante:', err);
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
          onSelectItem={(item) => setItemSelecionado(item)}
        />
      </div>

      {itemSelecionado && (
        <ModalProduto
          item={itemSelecionado}
          onClose={() => setItemSelecionado(null)}
          // Removido onAddToCart porque ModalProduto chama diretamente o serviço
        />
      )}
    </div>
  );
};

export default RestaurantPage;
