// Modal.jsx
import React from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ type, onClose, onSubmit, restaurantData, onInputChange }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {type === "add" ? "Cadastrar Restaurante" : "Editar Restaurante"}
          </h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={onSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Nome</label>
            <input
              type="text"
              name="name"
              value={restaurantData.name}
              onChange={onInputChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Endereço</label>
            <input
              type="text"
              name="address"
              value={restaurantData.address}
              onChange={onInputChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Descrição</label>
            <textarea
              name="description"
              value={restaurantData.description}
              onChange={onInputChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Imagem</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={onInputChange}
              className="w-full mt-2"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {type === "add" ? "Cadastrar" : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
