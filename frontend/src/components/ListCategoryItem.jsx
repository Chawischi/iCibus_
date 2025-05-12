import PropTypes from 'prop-types';
import CategoryItem from './CategoryItem';
import { useState } from 'react'

const ListCategoryItem = ({ categorias, onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {categorias.map((category) => (
          <CategoryItem
            key={category.id}
            image={category.imagem}
            name={category.nome}
            isSelected={category.id === selectedCategory}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>
    </div>
  );
};

ListCategoryItem.propTypes = {
  categorias: PropTypes.array.isRequired,
  onSelectCategory: PropTypes.func,
};

export default ListCategoryItem;
