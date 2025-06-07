import { useEffect, useState } from 'react';
import HomeListCategory from '../components/HomeListCategory';
import HomeListRestaurant from '../components/HomeListRestaurant';
import { getCategories } from '../services/categoryServices';
import { getRestaurantsByCategory, getRestaurants } from '../services/restaurantServices';

const Home = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantes, setRestaurantes] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoriesResult = await getCategories();
        if (categoriesResult.success) {
          // Adiciona categoria "Todas" no início
          setCategorias([{ id: 0, nome: 'Todas' }, ...categoriesResult.categories]);
        } else {
          setError(categoriesResult.message || 'Erro ao buscar categorias.');
        }

        const allRestaurants = await getRestaurants();
        setRestaurantes(allRestaurants);
        setSelectedCategoryId(0); // marca "Todas" selecionada

      } catch (err) {
        setError('Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSelectCategory = async (category) => {
    setLoadingRestaurants(true);
    setError(null);
    setSelectedCategoryId(category.id);
    try {
      if (category.id === 0) {
        const allRestaurants = await getRestaurants();
        setRestaurantes(allRestaurants);
      } else {
        const restaurantesData = await getRestaurantsByCategory(category.id);
        setRestaurantes(restaurantesData);
      }
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
            selectedCategoryId={selectedCategoryId}
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
            <h2 className="text-xl font-bold mb-4 text-center">Nenhum restaurante encontrado.</h2>
          )}
        </>
      ) : (
        <p>Nenhuma categoria disponível.</p>
      )}
    </div>
  );
};

export default Home;
