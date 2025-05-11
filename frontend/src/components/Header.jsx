import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
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
        <div className="flex items-center space-x-2">
          <img src={iCibusLogo} alt="Logo" className="w-[120px] h-[120px]" />
        </div>

        <div className="flex items-center space-x-4 relative">
          {isLoggedIn ? (
            <>
              <FaUserCircle
                className="text-white text-4xl cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
              />
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
                className="px-6 py-2 border-2 border-white text-white font-semibold rounded-lg transition hover:bg-white hover:text-yellow-500"
              >
                Login
              </button>
              <button
                onClick={onCadastroClick}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg transition hover:bg-white hover:text-red-500"
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
