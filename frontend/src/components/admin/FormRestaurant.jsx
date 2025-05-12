import { useState } from 'react';
import PropTypes from 'prop-types';
import { createRestaurante } from '../../services/restaurantServices';

const FormRestaurant = ({ categorias }) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [horario, setHorario] = useState('');
  const [sobreNos, setSobreNos] = useState('');
  const [imagem, setImagem] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Garantir que categoriaSelecionada seja um array e o formate corretamente
  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('telefone', telefone);
  formData.append('endereco', endereco);
  formData.append('horario', horario);
  formData.append('sobreNos', sobreNos);

  // Verificando se imagem é um arquivo antes de enviar
  if (imagem) {
    formData.append('imagem', imagem);
  }

  // Adicionando categorias selecionadas no formato adequado
  categoriaSelecionada.forEach((id) => {
    if (typeof id === 'string' && id.length > 0) {
      formData.append('categoriaIds[]', id);  // Enviando categorias como array
    } else {
      console.error("ID inválido encontrado:", id);
    }
  });

  // Log para verificar os dados enviados
  console.log("Dados enviados para criar restaurante:", {
    nome,
    telefone,
    endereco,
    horario,
    sobreNos,
    imagem,
    categoriaSelecionada
  });

  try {
    // Enviando o FormData para o serviço
    const response = await createRestaurante(formData);

    // Resetando os campos do formulário após o envio com sucesso
    setNome('');
    setTelefone('');
    setEndereco('');
    setHorario('');
    setSobreNos('');
    setImagem(null);
    setCategoriaSelecionada([]);
    setDropdownAberto(false);
    
    console.log("Restaurante criado com sucesso:", response);
  } catch (err) {
    console.error('Erro ao criar restaurante:', err);
  }
};


  return (
    <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto bg-gray-100 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Cadastro de Restaurante</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Primeira Coluna */}
        <div className="space-y-3">
          <div>
            <label className="block mb-1 font-medium text-gray-600">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-600">Telefone</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-600">Endereço</label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-600">Horário</label>
            <input
              type="text"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Segunda Coluna */}
        <div className="space-y-3">
          <div>
            <label className="block mb-1 font-medium text-gray-600">Sobre Nós</label>
            <textarea
              value={sobreNos}
              onChange={(e) => setSobreNos(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg h-24 resize-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-600">Imagem</label>
            <input
              type="file"
              onChange={(e) => setImagem(e.target.files[0])}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Dropdown de Categorias com Checkboxes */}
          <div className="relative">
            <label className="block mb-1 font-medium text-gray-600">Categorias</label>

            <button
              type="button"
              onClick={() => setDropdownAberto(!dropdownAberto)}
              className="w-full text-left bg-white border border-gray-300 rounded-lg px-4 py-2"
            >
              {categoriaSelecionada.length > 0
                ? categoriaSelecionada
                  .map((id) => categorias.find((cat) => cat.id === id)?.nome)
                  .filter(Boolean)
                  .join(', ')
                : 'Selecione as categorias'}
            </button>

            {dropdownAberto && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-40 overflow-y-auto">
                {categorias.map((categoria) => (
                  <label
                    key={categoria.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={categoria.id}
                      checked={categoriaSelecionada.includes(categoria.id)}
                      onChange={(e) => {
                        const id = e.target.value;
                        setCategoriaSelecionada((prevSelecionadas) =>
                          prevSelecionadas.includes(id)
                            ? prevSelecionadas.filter((item) => item !== id)
                            : [...prevSelecionadas, id]
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

      {/* Botão */}
      <button
        type="submit"
        className="block w-full md:w-64 mx-auto mt-6 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
      >
        Criar Restaurante
      </button>
    </form>
  );
};

FormRestaurant.propTypes = {
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nome: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FormRestaurant;
