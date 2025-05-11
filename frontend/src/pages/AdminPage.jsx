import React, { useState, useEffect } from "react";
import { fetchUserData } from "../services/authServices";
import { FaPlusCircle, FaEdit, FaTrash } from "react-icons/fa"; // Ícones para adicionar, editar e excluir
import Modal from "../components/restaurantModal"; // Modal de cadastro de restaurante

const AdminPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // Tipo do modal: "add" ou "edit"
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Restaurante selecionado para edição
  const [newRestaurantData, setNewRestaurantData] = useState({
    name: "",
    address: "",
    description: "",
    image: null, // Para armazenar a imagem do restaurante
  });

  useEffect(() => {
    // Função para carregar os dados do usuário (caso necessário para a autenticação)
    const loadUserData = async () => {
      const user = await fetchUserData();
      if (user) {
        // Lógica para carregar a lista de restaurantes do backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurants`);
        const data = await response.json();
        setRestaurants(data); // Assume que o backend retorna uma lista de restaurantes
      }
    };

    loadUserData();
  }, []);

  // Função para adicionar restaurante
  const handleAddRestaurantSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", newRestaurantData.name);
    formData.append("address", newRestaurantData.address);
    formData.append("description", newRestaurantData.description);
    formData.append("image", newRestaurantData.image);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurants/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Restaurante adicionado com sucesso", data);
      setRestaurants([...restaurants, data]); // Atualizar a lista de restaurantes
      setShowModal(false);
      setNewRestaurantData({ name: "", address: "", description: "", image: null });
    } else {
      console.error("Erro ao adicionar restaurante:", data.message);
    }
  };

  // Função para editar restaurante
  const handleEditRestaurant = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", newRestaurantData.name);
    formData.append("address", newRestaurantData.address);
    formData.append("description", newRestaurantData.description);
    if (newRestaurantData.image) {
      formData.append("image", newRestaurantData.image);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurants/edit/${selectedRestaurant.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Restaurante editado com sucesso", data);
      setRestaurants(
        restaurants.map((restaurant) =>
          restaurant.id === selectedRestaurant.id ? data : restaurant
        )
      );
      setShowModal(false);
      setSelectedRestaurant(null);
      setNewRestaurantData({ name: "", address: "", description: "", image: null });
    } else {
      console.error("Erro ao editar restaurante:", data.message);
    }
  };

  // Função para excluir restaurante
  const handleDeleteRestaurant = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurants/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Restaurante excluído com sucesso", data);
      setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
    } else {
      console.error("Erro ao excluir restaurante:", data.message);
    }
  };

  // Função para atualizar os dados do restaurante no modal
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setNewRestaurantData({ ...newRestaurantData, [name]: files[0] });
    } else {
      setNewRestaurantData({ ...newRestaurantData, [name]: value });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRestaurant(null); // Resetar o restaurante selecionado
    setNewRestaurantData({ name: "", address: "", description: "", image: null });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Página de Administração</h1>

      <div className="mb-4 text-right">
        <button
          onClick={() => {
            setModalType("add");
            setShowModal(true);
          }}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          <FaPlusCircle className="inline mr-2" />
          Adicionar Restaurante
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold">{restaurant.name}</h2>
            <p className="text-gray-600">{restaurant.description}</p>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  setSelectedRestaurant(restaurant);
                  setModalType("edit");
                  setNewRestaurantData({
                    name: restaurant.name,
                    address: restaurant.address,
                    description: restaurant.description,
                    image: null,
                  });
                  setShowModal(true);
                }}
                className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                <FaEdit className="inline mr-2" />
                Editar
              </button>
              <button
                onClick={() => handleDeleteRestaurant(restaurant.id)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <FaTrash className="inline mr-2" />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de adicionar/editar restaurante */}
      {showModal && (
        <Modal
          type={modalType}
          onClose={handleCloseModal}
          onSubmit={modalType === "add" ? handleAddRestaurantSubmit : handleEditRestaurant}
          restaurantData={newRestaurantData}
          onInputChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default AdminPage;
