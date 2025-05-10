import PropTypes from 'prop-types';
import iCibusLogo from '../assets/logo_icibus2.png';

const Header = ({ onLoginClick, onCadastroClick }) => {
  return (
    <header className="w-full h-[120px] bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 shadow-md flex items-center">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center w-full">
        {/* Logo / Imagem do site */}
        <div className="flex items-center space-x-2">
          <img src={iCibusLogo} alt="Logo" className="w-[120px] h-[120px]" />
        </div>

        {/* Botões */}
        <div className="flex space-x-4">
          <button
            onClick={onLoginClick}
            className="px-4 py-2 bg-transparent text-white font-semibold rounded-lg transition hover:text-red-600"
          >
            Login
          </button>
          <button
            onClick={onCadastroClick}
            className="px-4 py-2 bg-transparent text-white font-semibold rounded-lg transition hover:text-red-600"
          >
            Cadastro
          </button>
        </div>
      </div>
    </header>
  );
};

// ✅ Aqui está a validação das props:
Header.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  onCadastroClick: PropTypes.func.isRequired,
};

export default Header;
