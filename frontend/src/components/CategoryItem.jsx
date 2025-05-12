import PropTypes from 'prop-types'; 

const CategoryItem = ({ image, name, isSelected, onClick }) => {
  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 border-2 rounded-xl min-w-20
        cursor-pointer group transition-all duration-200
        ${isSelected ? 'border-yellow-500 bg-yellow-50 text-primary' : 'border-red-500 hover:border-yellow-400 hover:bg-orange-50'}`}
      onClick={onClick}
    >
      <img
        src={`${import.meta.env.VITE_API_URL}/uploads/${image}`}
        alt={name}
        width={32}
        height={32}
        className="group-hover:scale-110 transition-all duration-200"
      />
      <h2 className="text-xs font-medium group-hover:text-primary text-center">{name}</h2>

    </div>
  );
};

CategoryItem.propTypes = {
  image: PropTypes.string.isRequired,  
  name: PropTypes.string.isRequired,   
  isSelected: PropTypes.bool.isRequired, 
  onClick: PropTypes.func.isRequired,   
};

export default CategoryItem;
