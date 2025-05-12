import PropTypes from 'prop-types';

const RestaurantItem = ({ name, category, image, rating }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 border-2 rounded-xl min-w-48 cursor-pointer group transition-all duration-200 hover:border-yellow-400 hover:bg-orange-50">
      <img
        src={image}  // Certifique-se de que a URL da imagem está correta
        alt={name}
        width={150}  // Ajuste o tamanho conforme necessário
        height={150}  // Ajuste o tamanho conforme necessário
        className="w-full h-48 object-cover rounded-md group-hover:scale-110 transition-all duration-200"
      />
      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary">{name}</h3>
      <p className="text-sm text-gray-600">{category}</p>
      <div className="flex items-center mt-2">
        <span className="text-yellow-500">★</span>
        <span className="ml-1 text-sm font-medium">{rating}/5</span>
      </div>
    </div>
  );
};

RestaurantItem.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
};

export default RestaurantItem;
