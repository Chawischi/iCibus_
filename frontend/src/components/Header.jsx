import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import iCibusLogo from '../assets/logo_icibus2.png';
import { useNavigate } from "react-router-dom";

const Header = ({ onLoginClick, onCadastroClick, isLoggedIn, userEmail, userRole, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleGoToAdminPage = () => {
    navigate("/admin");
  };

  return (
    <header className="w-full h-[120px] bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 shadow-md flex items-center">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center w-full">

        {/* Logo com link para Home */}
        <div className="flex items-center space-x-2">
          <img
            src={iCibusLogo}
            alt="Logo"
            className="w-[120px] h-[120px] cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="flex items-center space-x-4 relative">
          {isLoggedIn ? (
            <>
              {/* Ícone do carrinho */}
              <FaShoppingCart className="text-white text-3xl cursor-pointer hover:text-yellow-200"
                onClick={() => navigate('/carrinho')}
              />

              {/* Separação entre ícones */}
              <div className="ml-6">
                <FaUserCircle
                  className="text-white text-4xl cursor-pointer hover:text-yellow-200"
                  onClick={() => setShowMenu(!showMenu)}
                />
              </div>

              {showMenu && (
                <div className="absolute right-0 top-[60px] bg-white rounded-lg shadow-lg p-4 min-w-[200px] z-50">
                  <p className="text-sm text-gray-600">Bem-vindo(a)</p>
                  <p className="font-semibold text-gray-800 truncate">{userEmail}</p>

                  {userRole === 'admin' && (
                    <button
                      className="mt-3 w-full bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                      onClick={handleGoToAdminPage}
                    >
                      Ir para Administração
                    </button>
                  )}

                  <button
                    className="mt-3 w-full bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-white text-red-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
              >
                Login
              </button>
              <button
                onClick={onCadastroClick}
                className="px-4 py-2 bg-white text-red-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
              >
                Cadastro
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  onCadastroClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  userEmail: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
