import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  createItemMenu,
  getItensMenuByRestauranteId,
  deleteItemMenu,
  updateItemMenu,
} from '../../services/ItemMenuServices';

const FormItemMenu = ({
  restaurantes,
  restauranteSelecionado,
  setRestauranteSelecionado,
  itemSelecionado,
  setItemSelecionado,
  token,
  atualizarItens,
}) => {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);


  const resetarFormulario = useCallback(() => {
    setNome('');
    setPreco('');
    setDescricao('');
    setImagem(null);
    setItemSelecionado(null);
  }, [setItemSelecionado]);

  useEffect(() => {
    if (restauranteSelecionado?.id) {
      getItensMenuByRestauranteId(restauranteSelecionado.id, token)
        .then((result) => {
          console.log("Resultado da requisição:", result);
          if (!result.success) {
            console.error(result.message || 'Erro ao buscar itens do menu.');
          }
        })
        .catch((err) => {
          console.error('Erro ao buscar itens do menu:', err);
        });
      resetarFormulario();
    } else {
      resetarFormulario();
    }
  }, [restauranteSelecionado, token, resetarFormulario]);

  useEffect(() => {
    if (itemSelecionado) {
      setNome(itemSelecionado.nome || '');
      setPreco(itemSelecionado.preco || '');
      setDescricao(itemSelecionado.descricao || '');
      setImagem(null);
    } else {
      resetarFormulario();
    }
  }, [itemSelecionado, resetarFormulario]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!restauranteSelecionado?.id) {
      alert('Selecione um restaurante antes de continuar.');
      return;
    }
    if (!nome || !preco || !descricao) {
      alert('Preencha todos os campos.');
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('preco', preco);
    formData.append('descricao', descricao);
    formData.append('restauranteId', restauranteSelecionado.id);
    if (imagem) formData.append('imagem', imagem);

    try {
      if (itemSelecionado) {
        await updateItemMenu(itemSelecionado.id, formData, token);
        console.log('Item atualizado com sucesso!');
      } else {
        await createItemMenu(formData, token);
        console.log('Item criado com sucesso!');
      }
      await atualizarItens();
      resetarFormulario();
    } catch (err) {
      console.error('Erro ao enviar item:', err);
      alert('Erro ao salvar item do menu.');
    }
  };

  const handleDelete = async () => {
    if (!itemSelecionado) return;
    try {
      await deleteItemMenu(itemSelecionado.id, token);
      console.log('Item excluído com sucesso!');
      await atualizarItens();
      resetarFormulario();
    } catch (err) {
      console.error('Erro ao excluir item:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto bg-gray-100 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        {itemSelecionado ? 'Editar Item do Menu' : 'Cadastro de Item do Menu'}
      </h2>

      <select
        value={restauranteSelecionado?.id || ''}
        onChange={(e) => {
          const id = e.target.value;
          const restaurante = restaurantes.find((rest) => rest.id === id) || null;
          setRestauranteSelecionado(restaurante);
          resetarFormulario();
        }}
        required
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Selecione um restaurante</option>
        {restaurantes.map((r) => (
          <option key={r.id} value={r.id}>
            {r.nome}
          </option>
        ))}
      </select>

      {restauranteSelecionado && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Nome do Item"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
              placeholder="Preço"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              placeholder="Descrição"
              className="w-full col-span-2 p-2 border border-gray-300 rounded-lg resize-none h-24"
            />
            <input
              type="file"
              onChange={(e) => setImagem(e.target.files[0])}
              className="w-full col-span-2 p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-center gap-4 mt-6">
            {itemSelecionado ? (
              <>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Excluir
                </button>
                <button
                  type="button"
                  onClick={resetarFormulario}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="w-full md:w-64 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Criar Item
              </button>
            )}
          </div>
        </>
      )}
    </form>
  );
};

FormItemMenu.propTypes = {
  restaurantes: PropTypes.array.isRequired,
  restauranteSelecionado: PropTypes.object,
  setRestauranteSelecionado: PropTypes.func.isRequired,
  itemSelecionado: PropTypes.object,
  setItemSelecionado: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  atualizarItens: PropTypes.func.isRequired,
};

export default FormItemMenu;
