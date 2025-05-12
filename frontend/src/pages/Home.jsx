import { useEffect, useState } from 'react';
import ListCategoryItem from '../components/ListCategoryItem';
import { getCategories } from '../services/categoryServices';

const Home = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      console.error('Token não encontrado.');
      setLoading(false);
      return;
    }

    setToken(userToken);

    const fetchCategories = async () => {
      const result = await getCategories(userToken);
      if (result.success) {
        setCategorias(result.categories);
      } else {
        console.error(result.message);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleSelectCategory = (category) => {
    console.log('Categoria selecionada:', category);
  };

  return (
    <div className="p-4">
      {loading ? (
        <p>Carregando categorias...</p>
      ) : categorias.length > 0 ? (
        <ListCategoryItem
          categorias={categorias}
          onSelectCategory={handleSelectCategory}
        />
      ) : (
        <p>Nenhuma categoria disponível.</p>
      )}
    </div>
  );
};

export default Home;
