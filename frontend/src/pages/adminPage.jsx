import { useEffect, useState } from "react";
import FormCategory from "../components/admin/FormCategory";
import ListCategoryItem from "../components/ListCategoryItem";
import { createCategory, deleteCategory, getCategories } from "../services/categoryServices";
import FormRestaurant from "../components/admin/FormRestaurant";
import { getRestaurants } from "../services/restaurantServices";
import ListRestaurantItem from "../components/ListRestaurantItem";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("categoria");
  const [categoriaNome, setCategoriaNome] = useState("");
  const [categoriaImagem, setCategoriaImagem] = useState(null);
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);  // Estado para armazenar restaurantes

  const token = localStorage.getItem("token");

  // Fetch para categorias
  useEffect(() => {
    const fetchCategorias = async () => {
      const result = await getCategories(token);
      if (result.success) {
        setCategorias(result.categories);
      } else {
        console.error(result.message || "Erro ao buscar categorias.");
      }
    };
    fetchCategorias();
  }, [token]);

  // Fetch para restaurantes
  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        const result = await getRestaurants(token);
        console.log("Resultado da busca de restaurantes:", result); // Log para verificar a resposta
        if (result.success) {
          setRestaurantes(result.restaurantes);
        } else {
          console.error(result.message || "Erro ao buscar restaurantes.");
        }
      } catch (err) {
        console.error("Erro inesperado ao buscar restaurantes:", err);
      }
    };
    if (activeTab === "restaurante") {
      fetchRestaurantes();
    }
  }, [activeTab, token]);


  const handleCategoriaSubmit = async (e) => {
    e.preventDefault();

    if (!categoriaNome || !categoriaImagem) {
      alert("Preencha todos os campos!");
      return;
    }

    const result = await createCategory(categoriaNome, categoriaImagem, token);
    if (result.success) {
      setCategoriaNome("");
      setCategoriaImagem(null);
      setCategoriaSelecionadaId(null);
      const atualizar = await getCategories(token);
      if (atualizar.success) setCategorias(atualizar.categories);
    } else {
      alert(result.message || "Erro ao criar categoria.");
    }
  };

  const handleDeleteCategoria = async (id) => {
    if (!id || typeof id !== "string") {
      alert("ID da categoria inválido.");
      return;
    }

    const result = await deleteCategory(id, token);
    if (result.success) {
      setCategoriaNome("");
      setCategoriaImagem(null);
      setCategoriaSelecionadaId(null);
      // Recarrega as categorias
      const atualizar = await getCategories(token);
      if (atualizar.success) setCategorias(atualizar.categories);
    } else {
      alert(result.message || "Erro ao excluir categoria.");
    }
  };

  return (
    <div className="pt-6 px-4 w-full min-h-screen flex flex-col items-center space-y-6">
      <div className="flex space-x-4">
        {["categoria", "restaurante", "itensMenu"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md font-semibold transition 
              ${activeTab === tab ? "bg-red-600 text-white" : "bg-gray-300 text-black hover:bg-gray-400"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "categoria" && (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-4xl space-y-4 px-4">
            <FormCategory
              categoriaNome={categoriaNome}
              setCategoriaNome={setCategoriaNome}
              categoriaImagem={categoriaImagem}
              setCategoriaImagem={setCategoriaImagem}
              categoriaSelecionadaId={categoriaSelecionadaId}
              onDelete={handleDeleteCategoria}
              onSubmit={handleCategoriaSubmit}
            />

            <div className="w-full flex justify-center">
              <div className="w-full max-w-2xl">
                <ListCategoryItem
                  categorias={categorias}
                  onSelectCategory={(cat) => {
                    setCategoriaNome(cat.nome);
                    setCategoriaImagem(null);
                    setCategoriaSelecionadaId(cat.id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "restaurante" && (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-4xl space-y-4 px-4">
            {/* Passando categorias como prop para o FormRestaurant */}
            <FormRestaurant categorias={categorias} />

            <div className="w-full flex justify-center">
              <div className="w-full max-w-4xl">
                <ListRestaurantItem
                  restaurantes={restaurantes}
                  onSelectRestaurant={(restaurant) => {
                    // Você pode adicionar lógica ao selecionar o restaurante
                    console.log(restaurant);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
