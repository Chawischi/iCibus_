import { useEffect, useState } from 'react';
import HomeListCategory from '../components/HomeListCategory';
import HomeListRestaurant from '../components/HomeListRestaurant';
import { getCategories } from '../services/categoryServices';
import { getRestaurantsByCategory } from '../services/restaurantServices';

const Home = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantes, setRestaurantes] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories(); // ✅ Sem token agora
        if (result.success) {
          setCategorias(result.categories);
          setError(null);
        } else {
          console.error(result.message);
          setError(result.message || 'Erro ao buscar categorias.');
        }
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        setError('Erro ao buscar categorias.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectCategory = async (category) => {
    setLoadingRestaurants(true);
    setError(null);
    try {
      const restaurantesData = await getRestaurantsByCategory(category.id); // ✅ Já está sem token
      setRestaurantes(restaurantesData);
    } catch (err) {
      setError(err.message || 'Erro ao buscar restaurantes.');
      setRestaurantes([]);
    }
    setLoadingRestaurants(false);
  };

  return (
    <div className="p-4">
      {loading ? (
        <p>Carregando categorias...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : categorias.length > 0 ? (
        <>
          <HomeListCategory
            categories={categorias}
            onSelectCategory={handleSelectCategory}
          />

          {loadingRestaurants ? (
            <p>Carregando restaurantes...</p>
          ) : restaurantes.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4 text-center">Restaurantes</h2>
              <HomeListRestaurant
                restaurants={restaurantes}
                onSelectRestaurant={(restaurante) => console.log('Selecionado:', restaurante)}
              />
            </div>
          ) : (
            <h2 className="text-xl font-bold mb-4 text-center">Restaurantes</h2>
          )}
        </>
      ) : (
        <p>Nenhuma categoria disponível.</p>
      )}
    </div>
  );
};

export default Home;
