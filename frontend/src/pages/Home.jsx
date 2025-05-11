

import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Importando o Link para navegação
import CategoryItem from '../components/CategoryItem';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { name: 'Pizza', image: '/assets/pizza.jpg' },
    { name: 'Burgers', image: '/assets/burger.jpg' },
    { name: 'Sushi', image: '/assets/sushi.jpg' },
  ];

  const restaurants = [
    { name: 'Sushi Bar', category: 'Sushi', image: '/assets/sushi-banner.jpg', rating: 4.5 },
    { name: 'Pizza Palace', category: 'Pizza', image: '/assets/pizza-banner.jpg', rating: 4.8 },
    { name: 'Burger King', category: 'Burgers', image: '/assets/burger-banner.jpg', rating: 4.2 },
    { name: 'Sushi World', category: 'Sushi', image: '/assets/sushi-banner.jpg', rating: 4.7 },
    { name: 'Burger Shack', category: 'Burgers', image: '/assets/burger-banner.jpg', rating: 4.3 },
  ];

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
  };

  const filteredRestaurants = selectedCategory
    ? restaurants.filter((restaurant) => restaurant.category === selectedCategory)
    : restaurants;

  return (
    <div className="mt-10">
      
      <div className="flex justify-center gap-4 overflow-auto mb-8 px-4">
        {categories.map((category, index) => (
          <CategoryItem
            key={index}
            name={category.name}
            image={category.image}
            isSelected={selectedCategory === category.name}
            onClick={() => handleCategoryClick(category.name)}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center px-4">
        {filteredRestaurants.map((restaurant, index) => (
          <Link
            to={`/restaurant/${restaurant.name}`} 
            key={index}
            className="w-full"
          >
            <RestaurantCard
              name={restaurant.name}
              category={restaurant.category}
              image={restaurant.image}
              rating={restaurant.rating}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
