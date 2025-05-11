import { useState } from "react";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("usuarios");

  const buttons = [
    { id: "categoria", label: "Categoria" },
    { id: "restaurante", label: "Restaurante" },
    { id: "itensMenu", label: "Itens do menu" },
  ];

  return (
    <div className="pt-[15px] flex justify-center">
      <div className="flex space-x-4">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setActiveTab(btn.id)}
            className={`px-6 py-2 rounded-md font-semibold transition 
              ${
                activeTab === btn.id
                  ? "bg-red-600 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
