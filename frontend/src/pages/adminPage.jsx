import { useEffect, useState } from "react";
import FormCategory from "../components/admin/FormCategory";
import ListCategoryItem from "../components/ListCategoryItem";
import { createCategory, deleteCategory, getCategories } from "../services/categoryServices";
import FormRestaurant from "../components/admin/FormRestaurant";
import { getRestaurants } from "../services/restaurantServices";
import ListRestaurantItem from "../components/ListRestaurantItem";
import FormItemMenu from "../components/admin/FormItemMenu";
import ListItemMenuItem from "../components/ListItemMenuItem";
import { getItensMenuByRestauranteId } from "../services/ItemMenuServices";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("categoria");

  // Categorias
  const [categoriaNome, setCategoriaNome] = useState("");
  const [categoriaImagem, setCategoriaImagem] = useState(null);
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // Restaurantes
  const [restaurantes, setRestaurantes] = useState([]);
  const [selectedRestaurante, setSelectedRestaurante] = useState(null);

  // Itens de Menu
  const [itensMenu, setItensMenu] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch categorias
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

  // Fetch restaurantes
  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        const result = await getRestaurants(token);
        if (result.success) {
          setRestaurantes(result.restaurantes);
        } else {
          console.error(result.message || "Erro ao buscar restaurantes.");
        }
      } catch (err) {
        console.error("Erro inesperado ao buscar restaurantes:", err);
      }
    };

    if (["restaurante", "itensMenu"].includes(activeTab)) {
      fetchRestaurantes();
    }
  }, [activeTab, token]);

  // Fetch itens de menu ao selecionar restaurante
  useEffect(() => {
    const fetchItens = async () => {
      if (selectedRestaurante) {
        const result = await getItensMenuByRestauranteId(selectedRestaurante.id, token);
        if (result.success) {
          setItensMenu(result.itensMenu);
        } else {
          console.error(result.message || "Erro ao buscar itens de menu.");
        }
      }
    };
    fetchItens();
  }, [selectedRestaurante, token]);

  // Categoria - Create
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

  // Categoria - Delete
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
      const atualizar = await getCategories(token);
      if (atualizar.success) setCategorias(atualizar.categories);
    } else {
      alert(result.message || "Erro ao excluir categoria.");
    }
  };

  return (
    <div className="pt-6 px-4 w-full min-h-screen flex flex-col items-center space-y-6">
      {/* Tabs */}
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

      {/* CATEGORIAS */}
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

      {/* RESTAURANTES */}
      {activeTab === "restaurante" && (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-4xl space-y-4 px-4">
            <FormRestaurant
              categorias={categorias}
              selectedRestaurante={selectedRestaurante}
              setSelectedRestaurante={setSelectedRestaurante}
              atualizarLista={() => {
                getRestaurants(token).then(result => {
                  if (result.success) setRestaurantes(result.restaurantes);
                });
              }}
              token={token}
            />

            <div className="w-full flex justify-center">
              <div className="w-full max-w-4xl">
                <ListRestaurantItem
                  restaurantes={restaurantes}
                  onSelectRestaurant={setSelectedRestaurante}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ITENS DE MENU */}
      {activeTab === "itensMenu" && (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-4xl space-y-4 px-4">
            {/* FormItemMenu agora recebe props para controle externo */}
            <FormItemMenu
              restaurantes={restaurantes}
              restauranteSelecionado={selectedRestaurante}
              setRestauranteSelecionado={(restaurante) => {
                setSelectedRestaurante(restaurante);
                setItensMenu([]);
                setItemSelecionado(null);

                if (restaurante) {
                  getItensMenuByRestauranteId(restaurante.id, token).then(result => {
                    if (result.success) setItensMenu(result.itensMenu);
                  });
                }
              }}
              itemSelecionado={itemSelecionado}
              setItemSelecionado={setItemSelecionado}
              token={token}
              atualizarItens={async () => {
                if (selectedRestaurante) {
                  const result = await getItensMenuByRestauranteId(selectedRestaurante.id, token);
                  if (result.success) setItensMenu(result.itensMenu);
                }
              }}
            />


            {/* Lista visual e interativa de itens de menu */}
            <ListItemMenuItem
              itens={itensMenu}
              onSelectItem={(item) => setItemSelecionado(item)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
