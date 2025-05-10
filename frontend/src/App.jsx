import { useState } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';

function App() {
  const [modalType, setModalType] = useState(null);

  return (
    <div className="bg-gray-200 min-h-screen" >
      <Header 
        onLoginClick={() => setModalType("login")}
        onCadastroClick={() => setModalType("cadastro")}
      />
      {modalType && <Modal type={modalType} onClose={() => setModalType(null)} />}
    </div>
  );
}

export default App;
