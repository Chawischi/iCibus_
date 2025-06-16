/*const ModalProduto = ({ item, onClose, onAddToCart }) => {
    if (!item) return null;

    const BASE_IMAGE_URL = 'http://localhost:3000/uploads/';

    const imageUrl = item.imagem
        ? item.imagem.startsWith('http')
            ? item.imagem
            : `${BASE_IMAGE_URL}${item.imagem}`
        : 'https://via.placeholder.com/400x300?text=Imagem+Indisponível';

    const handleAdd = async () => {
      try {
        await onAddToCart(item.id, 1);
        alert('Produto adicionado ao carrinho');
        onClose();
      } catch {
        alert('Erro ao adicionar ao carrinho');
      }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-xl w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
                >
                    &times;
                </button>

                <img
                    src={imageUrl}
                    alt={item.nome}
                    className="w-full h-52 object-cover rounded mb-6"
                />

                <h3 className="text-2xl font-bold mb-3">{item.nome}</h3>
                <p className="text-gray-700 mb-4">{item.descricao}</p>
                <p className="text-green-600 font-semibold text-lg mb-6">
                    R$ {Number(item.preco).toFixed(2)}
                </p>

                <button
                    className="mt-4 w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-green-600 transition"
                    onClick={handleAdd}
                >
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    );
};

export default ModalProduto;
*/

import PropTypes from 'prop-types';
import { useState } from 'react';
import { addItemToCart } from '../services/cartServices';

const ModalProduto = ({ item, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!item) return null;

  const BASE_IMAGE_URL = import.meta.env.VITE_API_URL + '/uploads/';

  const imageUrl =
    typeof item.imagem === 'string' && item.imagem.startsWith('http')
      ? item.imagem
      : item.imagem
      ? `${BASE_IMAGE_URL}${item.imagem}`
      : 'https://via.placeholder.com/400x300?text=Imagem+Indisponível';

  const handleAdd = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado.');

      await addItemToCart(item.id, 1, token);

      // Aqui você pode usar algum sistema de toast no futuro, por enquanto só fecha modal
      onClose();
    } catch (error) {
      setErrorMsg(error.message || 'Erro ao adicionar ao carrinho');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
          aria-label="Fechar modal"
        >
          &times;
        </button>

        <img
          src={imageUrl}
          alt={item.nome || 'Imagem do produto'}
          className="w-full h-52 object-cover rounded mb-6"
        />

        <h3 className="text-2xl font-bold mb-3">{item.nome || 'Sem nome'}</h3>
        <p className="text-gray-700 mb-4">{item.descricao || 'Sem descrição'}</p>
        <p className="text-green-600 font-semibold text-lg mb-6">
          R$ {item.preco !== undefined ? Number(item.preco).toFixed(2) : '0.00'}
        </p>

        {errorMsg && (
          <p className="mb-4 text-red-600 font-semibold text-center">{errorMsg}</p>
        )}

        <button
          className={`mt-4 w-full py-3 px-4 rounded text-white transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-green-600'
          }`}
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  );
};

ModalProduto.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nome: PropTypes.string,
    descricao: PropTypes.string,
    preco: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    imagem: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default ModalProduto;
