import PropTypes from 'prop-types';

const DetailsRestaurant = ({ restaurant }) => {
  if (!restaurant || !restaurant.nome) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="h-[500px] w-[280px] bg-gray-100 shadow-xl rounded-lg p-4 flex flex-col justify-start overflow-y-auto">
      <h2 className="text-xl font-bold mb-7">{restaurant.nome}</h2>
      <p className="mb-4 pb-2 border-b border-gray-300 last:border-b-0">
        <strong>Telefone:</strong> {restaurant.telefone}
      </p>
      <p className="mb-4 pb-2 border-b border-gray-300 last:border-b-0">
        <strong>Endereço:</strong> {restaurant.endereco}
      </p>
      <p className="mb-4 pb-2 border-b border-gray-300 last:border-b-0">
        <strong>Horário:</strong> {restaurant.horario}
      </p>
      <p className="mb-4 pb-2 border-b border-gray-300 last:border-b-0">
        <strong>Sobre Nós:</strong> {restaurant.sobreNos}
      </p>
    </div>
  );
};

DetailsRestaurant.propTypes = {
  restaurant: PropTypes.shape({
    nome: PropTypes.string.isRequired,
    telefone: PropTypes.string,
    endereco: PropTypes.string,
    horario: PropTypes.string,
    sobreNos: PropTypes.string,
  }).isRequired,
};

export default DetailsRestaurant;
