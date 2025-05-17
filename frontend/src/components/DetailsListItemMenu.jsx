import PropTypes from 'prop-types';
import ListItemMenuItem from './ListItemMenuItem';
import { useState, useEffect } from 'react';

const DetailsListItemMenu = ({ restauranteId, fetchItemsFunc, onSelectItem }) => {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restauranteId) return;

    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchItemsFunc(restauranteId);
        if (data && Array.isArray(data.itensMenu)) {
          setItens(data.itensMenu);
        } else {
          console.warn('Formato inesperado do retorno da API:', data);
          setItens([]);
        }
      } catch (err) {
        console.error('Erro ao buscar dados do menu:', err);
        setError('Erro ao carregar itens do menu');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [restauranteId, fetchItemsFunc]);

  if (loading) return <p>Carregando itens do menu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!itens.length) return <p>Nenhum item no menu.</p>;

  return (
    <div>
      <ListItemMenuItem itens={itens} onSelectItem={onSelectItem} />
    </div>
  );
};

DetailsListItemMenu.propTypes = {
  restauranteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  fetchItemsFunc: PropTypes.func.isRequired,
  onSelectItem: PropTypes.func,
};

export default DetailsListItemMenu;
