import PropTypes from "prop-types";

const FormCategory = ({
  categoriaNome,
  setCategoriaNome,
  categoriaImagem,
  setCategoriaImagem,
  categoriaSelecionadaId,
  onDelete,
  mensagem,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-2xl mx-auto flex flex-col space-y-4 bg-gray-100 p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold text-center">
        {categoriaSelecionadaId ? "Editar Categoria" : "Nova Categoria"}
      </h2>

      <input
        type="text"
        placeholder="Nome da categoria"
        value={categoriaNome}
        onChange={(e) => setCategoriaNome(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded"
      />

      <input
        type="file"
        onChange={(e) => setCategoriaImagem(e.target.files[0])}
        className="w-full"
        accept="image/*"
      />

      {categoriaImagem && (
        <p className="text-sm text-gray-600">Imagem selecionada: {categoriaImagem.name}</p>
      )}

      <div className="flex justify-center space-x-2">
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Salvar Categoria
        </button>

        {categoriaSelecionadaId && (
          <button
            type="button"
            onClick={() => onDelete(categoriaSelecionadaId)} 
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Excluir
          </button>
        )}
      </div>
      {mensagem && <p className="text-sm text-gray-700">{mensagem}</p>}
    </form>
  );
};

FormCategory.propTypes = {
  categoriaNome: PropTypes.string.isRequired,
  setCategoriaNome: PropTypes.func.isRequired,
  categoriaImagem: PropTypes.any,
  setCategoriaImagem: PropTypes.func.isRequired,
  categoriaSelecionadaId: PropTypes.string, // novo prop
  onDelete: PropTypes.func, // novo prop
  mensagem: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

export default FormCategory;
