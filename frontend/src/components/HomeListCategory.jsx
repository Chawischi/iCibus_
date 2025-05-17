import { useState } from 'react';
import PropTypes from 'prop-types';
import CategoryItem from './CategoryItem';

const HomeListCategory = ({ categories, onSelectCategory }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategoryId(category.id);
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            image={category.imagem}
            name={category.nome}
            isSelected={category.id === selectedCategoryId}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>
    </div>
  );
};

HomeListCategory.propTypes = {
  categories: PropTypes.array.isRequired,
  onSelectCategory: PropTypes.func,
};

export default HomeListCategory;
