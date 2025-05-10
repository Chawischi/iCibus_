import PropTypes from "prop-types";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { loginUser, registerUser } from "../services/authServices";
import { FaSpinner } from "react-icons/fa"; // Ícone de carregamento

const Modal = ({ type, onClose }) => {
  const isLogin = type === "login";
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(""); // Adicionando o estado para o email
  const [message, setMessage] = useState(""); // Para mostrar mensagens de erro ou sucesso
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento

  // Função para enviar o formulário (login ou cadastro)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Limpa mensagens anteriores
    setIsLoading(true); // Inicia o carregamento

    // Lógica de login
    if (isLogin) {
      const result = await loginUser(email, password);
      if (result) {
        setMessage("Login bem-sucedido!");
        onClose(); // Fecha o modal após o login
      } else {
        setMessage("Erro no login. Verifique suas credenciais.");
      }
    } else {
      // Lógica de cadastro
      if (password !== confirmPassword) {
        setMessage("As senhas não coincidem.");
        setIsLoading(false); // Desativa o carregamento em caso de erro
        return;
      }

      const result = await registerUser(email, password);
      if (result) {
        setMessage("Usuário cadastrado com sucesso!");
        onClose(); // Fecha o modal após o cadastro
      } else {
        setMessage("Erro ao cadastrar usuário.");
      }
    }

    setIsLoading(false); // Desativa o carregamento após a operação
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

        {/* Se não for login, mostramos os campos de senha e confirmar senha */}
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

        {/* Mostrar mensagem de erro ou sucesso */}
        {message && <p className="text-red-500 text-center mb-4">{message}</p>}

        {/* Botões centralizados e distribuídos igualmente */}
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
            disabled={isLoading} // Desabilita o botão se estiver carregando
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
};

export default Modal;
