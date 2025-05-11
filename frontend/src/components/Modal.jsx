import PropTypes from "prop-types";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { loginUser, registerUser } from "../services/authServices";
import { FaSpinner } from "react-icons/fa";

const Modal = ({ type, onClose, onLoginSuccess }) => {
  const isLogin = type === "login";
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setIsLoading(true);

  if (isLogin) {
    const result = await loginUser(email, password);
    if (result) {
      localStorage.setItem("userEmail", result.user.email);
      localStorage.setItem("userRole", result.user.role); // Garantia extra
      if (onLoginSuccess) onLoginSuccess(result.user.email, result.user.role); // ✅ Agora envia role
      setMessage("Login bem-sucedido!");
      onClose();
    } else {
      setMessage("Erro no login. Verifique suas credenciais.");
    }
  } else {
    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    const result = await registerUser(email, password);
    if (result) {
      setMessage("Usuário cadastrado com sucesso!");
      onClose();
    } else {
      setMessage("Erro ao cadastrar usuário.");
    }
  }

  setIsLoading(false);
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-200 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isLogin ? "Login" : "Cadastro"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-md"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
          </div>
        </div>

        {!isLogin && (
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
            </div>
          </div>
        )}

        {message && <p className="text-red-500 text-center mb-4">{message}</p>}

        <div className="flex justify-between space-x-2">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-600 flex-1"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mx-auto" size={24} />
            ) : (
              isLogin ? "Entrar" : "Cadastrar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  type: PropTypes.oneOf(["login", "cadastro"]).isRequired,
  onClose: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func, // ✅ nova prop opcional
};

export default Modal;
