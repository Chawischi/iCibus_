import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Modal from "./components/Modal";
import Home from "./pages/Home";
import AdminPage from "./pages/adminPage";
import { createCategory } from "./services/categoryServices";
import { useNavigate } from "react-router-dom";

function App() {
  const [modalType, setModalType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  // Estado do formulário
  const [categoriaNome, setCategoriaNome] = useState("");
  const [categoriaImagem, setCategoriaImagem] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    if (token && email && role) {
      setIsLoggedIn(true);
      setUserEmail(email);
      setUserRole(role);
    }
  }, []);

  const handleLoginSuccess = (email, role) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserRole(role);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
    setModalType(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserEmail("");
    setUserRole("");
    navigate("/")
  };

  // Função para enviar a categoria
  const handleCategoriaSubmit = async () => {
    if (!categoriaNome || !categoriaImagem) {
      setMensagem("Preencha todos os campos!");
      return;
    }

    const token = localStorage.getItem("token");

    const result = await createCategory(categoriaNome, categoriaImagem, token);

    if (result.success) {
      setMensagem("Categoria criada com sucesso!");
      setCategoriaNome("");
      setCategoriaImagem(null);
    } else {
      setMensagem(result.message || "Erro ao criar categoria.");
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen">
      <Header
        onLoginClick={() => setModalType("login")}
        onCadastroClick={() => setModalType("cadastro")}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        userRole={userRole}
        onLogout={handleLogout}
      />

      {modalType && (
        <Modal
          type={modalType}
          onClose={() => setModalType(null)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/admin"
          element={
            <AdminPage
              categoriaNome={categoriaNome}
              setCategoriaNome={setCategoriaNome}
              categoriaImagem={categoriaImagem}
              setCategoriaImagem={setCategoriaImagem}
              mensagem={mensagem}
              setMensagem={setMensagem}
              handleCategoriaSubmit={handleCategoriaSubmit}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
