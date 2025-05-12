import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRestaurante, saveRestaurante, deleteRestaurante } from '../../services/restaurantServices';

const FormRestaurant = ({ categorias, selectedRestaurante, setSelectedRestaurante, token, atualizarLista }) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [horario, setHorario] = useState('');
  const [sobreNos, setSobreNos] = useState('');
  const [imagem, setImagem] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);

  // Atualiza o formulário se um restaurante for selecionado
  useEffect(() => {
    if (selectedRestaurante) {
      setNome(selectedRestaurante.nome || '');
      setTelefone(selectedRestaurante.telefone || '');
      setEndereco(selectedRestaurante.endereco || '');
      setHorario(selectedRestaurante.horario || '');
      setSobreNos(selectedRestaurante.sobreNos || '');
      setCategoriaSelecionada(selectedRestaurante.categorias?.map(cat => cat.id) || []);
    }
  }, [selectedRestaurante]);

  const resetarFormulario = () => {
    setNome('');
    setTelefone('');
    setEndereco('');
    setHorario('');
    setSobreNos('');
    setImagem(null);
    setCategoriaSelecionada([]);
    setDropdownAberto(false);
    setSelectedRestaurante(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('telefone', telefone);
    formData.append('endereco', endereco);
    formData.append('horario', horario);
    formData.append('sobreNos', sobreNos);
    if (imagem) formData.append('imagem', imagem);
    categoriaSelecionada.forEach(id => formData.append('categoriaIds[]', id));

    try {
      if (selectedRestaurante) {
        await saveRestaurante(selectedRestaurante.id, formData, token);
        console.log('Restaurante atualizado com sucesso!');
      } else {
        await createRestaurante(formData, token);
        console.log('Restaurante criado com sucesso!');
      }
      resetarFormulario();
      atualizarLista();
    } catch (err) {
      console.error('Erro ao enviar restaurante:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedRestaurante) return;
    if (!window.confirm('Tem certeza que deseja excluir este restaurante?')) return;

    try {
      await deleteRestaurante(selectedRestaurante.id, token);
      console.log('Restaurante excluído com sucesso!');
      resetarFormulario();
      atualizarLista();
    } catch (err) {
      console.error('Erro ao excluir restaurante:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto bg-gray-100 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        {selectedRestaurante ? 'Editar Restaurante' : 'Cadastro de Restaurante'}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Primeira Coluna */}
        <div className="space-y-3">
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Nome" className="w-full p-2 border border-gray-300 rounded-lg" />
          <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} required placeholder="Telefone" className="w-full p-2 border border-gray-300 rounded-lg" />
          <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} required placeholder="Endereço" className="w-full p-2 border border-gray-300 rounded-lg" />
          <input type="text" value={horario} onChange={(e) => setHorario(e.target.value)} required placeholder="Horário" className="w-full p-2 border border-gray-300 rounded-lg" />
        </div>

        {/* Segunda Coluna */}
        <div className="space-y-3">
          <textarea value={sobreNos} onChange={(e) => setSobreNos(e.target.value)} required placeholder="Sobre Nós" className="w-full p-2 border border-gray-300 rounded-lg h-24 resize-none" />
          <input type="file" onChange={(e) => setImagem(e.target.files[0])} className="w-full p-2 border border-gray-300 rounded-lg" />

          {/* Dropdown Categorias */}
          <div className="relative">
            <button type="button" onClick={() => setDropdownAberto(!dropdownAberto)} className="w-full text-left bg-white border border-gray-300 rounded-lg px-4 py-2">
              {categoriaSelecionada.length > 0
                ? categoriaSelecionada.map((id) => categorias.find((c) => c.id === id)?.nome).filter(Boolean).join(', ')
                : 'Selecione as categorias'}
            </button>

            {dropdownAberto && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-40 overflow-y-auto">
                {categorias.map((categoria) => (
                  <label key={categoria.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      value={categoria.id}
                      checked={categoriaSelecionada.includes(categoria.id)}
                      onChange={(e) => {
                        const id = e.target.value;
                        setCategoriaSelecionada((prev) =>
                          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
                        );
                      }}
                      className="mr-2"
                    />
                    {categoria.nome}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-center gap-4 mt-6">
        {selectedRestaurante ? (
          <>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
              Salvar
            </button>
            <button type="button" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg">
              Excluir
            </button>
            <button type="button" onClick={resetarFormulario} className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg">
              Cancelar
            </button>
          </>
        ) : (
          <button type="submit" className="w-full md:w-64 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg">
            Criar Restaurante
          </button>
        )}
      </div>
    </form>
  );
};

FormRestaurant.propTypes = {
  categorias: PropTypes.array.isRequired,
  selectedRestaurante: PropTypes.object,
  setSelectedRestaurante: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  atualizarLista: PropTypes.func.isRequired,
};

export default FormRestaurant;
