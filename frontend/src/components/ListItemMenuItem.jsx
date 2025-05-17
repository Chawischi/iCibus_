import PropTypes from 'prop-types';
import ItemMenuItem from './ItemMenuItem';
import { useState } from 'react';

const ListItemMenuItem = ({ itens, onSelectItem }) => {
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItemId(item.id);
    if (onSelectItem) onSelectItem(item);
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {itens.map((item) => (
          <ItemMenuItem
            key={item.id}
            nome={item.nome}
            preco={item.preco}
            image={item.imagem}
            isSelected={item.id === selectedItemId}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

ListItemMenuItem.propTypes = {
  itens: PropTypes.array.isRequired,
  onSelectItem: PropTypes.func,
};

export default ListItemMenuItem;
