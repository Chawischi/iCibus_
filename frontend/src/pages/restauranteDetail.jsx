import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RestaurantDetailCard from '../components/RestaurantDetailCard';

const RestaurantDetail = () => {
  const { id } = useParams();
  const restaurantId = parseInt(id, 10);  
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {

    const restaurantData = {
      '1': {
        name: 'Sushi Bar',
        category: 'Sushi',
        about: 'Um restaurante especializado em sushi fresco.',
        address: 'Rua X, 123',
        phone: '1234-5678',
        hours: '10:00 - 22:00',
        items: [
          {
            name: 'Sushi Especial',
            description: 'Sushi com salmão fresco e arroz temperado.',
            price: '35,00',
            image: '/assets/sushi.jpg'
          },
          {
            name: 'Temaki',
            description: 'Temaki de atum com arroz e alga crocante.',
            price: '25,00',
            image: '/assets/temaki.jpg'
          }
        ]
      },
      '2': {
        name: 'Pizza Palace',
        category: 'Pizza',
        about: 'Aqui você encontra as melhores pizzas da cidade.',
        address: 'Rua Y, 456',
        phone: '9876-5432',
        hours: '11:00 - 23:00',
        items: [
          {
            name: 'Pizza Marguerita',
            description: 'Pizza tradicional com molho de tomate e manjericão.',
            price: '30,00',
            image: '/assets/pizza.jpg'
          },
          {
            name: 'Pizza Pepperoni',
            description: 'Pizza com pepperoni, queijo e molho picante.',
            price: '40,00',
            image: '/assets/pepperoni.jpg'
          }
        ]
      }
    };

    const restaurantDataFetched = restaurantData[id];
    setRestaurant(restaurantDataFetched);
  }, [id]);

  return (
    <div className="restaurant-detail-page">
      {restaurant ? (
        <RestaurantDetailCard restaurant={restaurant} />
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default RestaurantDetail;
