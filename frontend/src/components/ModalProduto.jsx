const ModalProduto = ({ item, onClose, onAddToCart }) => {
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
