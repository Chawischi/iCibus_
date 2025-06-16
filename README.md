# **Icibus - Plataforma de Pedidos Online**  

Icibus é uma **plataforma web de pedidos de comida** que conecta clientes a restaurantes, permitindo que os usuários visualizem menus, façam pedidos, realizem pagamentos simulados e acompanhem o status das entregas. O sistema possui funcionalidades tanto para consumidores quanto para administradores de restaurantes.  

# 🧩 Domínio do Problema
O sistema iCibus foi desenvolvido para resolver a dificuldade que muitos restaurantes enfrentam na gestão de pedidos online com entrega. Em geral, esses estabelecimentos lidam com plataformas separadas para exibir produtos, registrar pedidos e controlar o fluxo de entrega, o que gera falhas de comunicação e ineficiência. O iCibus centraliza esse processo em uma aplicação web, permitindo que os usuários façam pedidos de forma prática, enquanto os administradores gerenciam restaurantes, itens e categorias de forma unificada.

## **📌 Funcionalidades**  
### **Para clientes**  
✅ Visualização de menus e produtos  
✅ Adição de itens ao carrinho  
✅ Simulação de pagamento  
✅ Acompanhamento do status do pedido  

### **Para administradores**  
✅ Cadastro e gerenciamento de produtos  
✅ Atualização do status das entregas  

## **🛠️ Tecnologias Utilizadas**  
O Icibus foi desenvolvido utilizando as seguintes tecnologias:  

[![Tailwind](https://img.shields.io/badge/TailwindCSS-06B6D4.svg?style=for-the-badge&logo=TailwindCSS&logoColor=white)](https://tailwindcss.com/)  
[![React](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

Optamos pelo React para construir interfaces dinâmicas e responsivas, garantindo uma experiência fluida para o usuário. Utilizamos Vite para o empacotamento de código e o servidor de desenvolvimento, proporcionando um fluxo de trabalho mais rápido e eficiente. Para o banco de dados, escolhemos o PostgreSQL pela sua robustez e escalabilidade. A autenticação será tratada de maneira personalizada, sem o uso do Clerk, e o Tailwind CSS facilitará a estilização, tornando o desenvolvimento mais ágil e organizado, sem a necessidade de escrever CSS manualmente.

# 🏗️ Arquitetura do Sistema
O sistema adota uma arquitetura em camadas baseada no padrão MVC (Model-View-Controller):

Backend desenvolvido com Node.js e Express.js, estruturado em modelos, controladores, rotas e middlewares.

Frontend criado com React.js e Vite, como uma Single Page Application (SPA), com componentes reutilizáveis e estilização via Tailwind CSS.

A separação entre as camadas facilita a manutenção, a escalabilidade e a integração futura com serviços externos.



## **📈 Estratégia de Desenvolvimento**  
- **Fase 1: Protótipo e Validação**  
  - Desenvolvimento do frontend e estrutura básica do backend.
  - Configuração do banco de dados e sistema de autenticação.
  - Testes iniciais de usabilidade.  

- **Fase 2: Implementação das Funcionalidades Principais**  
  - Implementação do fluxo de pedidos e simulação de pagamento.  
  - Dashboard para administradores gerenciarem produtos e pedidos.  

- **Fase 3: Otimizações e Testes**  
  - Melhorias de performance e segurança.
  - Testes de carga para avaliar a escalabilidade.  

- **Fase 4: Lançamento e Monitoramento**  
  - Implantação da plataforma.  
  - Monitoramento e ajustes conforme feedback dos usuários.  
  
## **🔍 Requisitos do Sistema**  
### **Para Clientes**  
- **RF01:** O sistema deve permitir que os clientes visualizem os menus dos restaurantes cadastrados.
- **RF02:** O cliente deve poder adicionar e remover itens do pedido.
- **RF03:** O sistema deve permitir que o cliente simule um pagamento usando informações cadastradas.
- **RF04:** O cliente deve poder acompanhar o status do pedido em tempo real.

### **Para Administradores de Restaurantes**  
- **RF05:** O sistema deve permitir que os administradores cadastrem, editem e removam itens do menu.
- **RF06:** O sistema deve atualizar automaticamente o status dos pedidos com base no andamento do processo de entrega.

### **Requisitos Não Funcionais (RNF)**  
Os requisitos não funcionais definem características de qualidade e restrições do sistema.

- **RNF01:** O sistema deve ser acessível via navegadores modernos (Google Chrome, Mozilla Firefox, Microsoft Edge).
- **RNF02:** A plataforma deve ter um design responsivo para funcionar em desktops, tablets e dispositivos móveis.
- **RNF03:** O tempo de resposta para carregar menus e pedidos deve ser inferior a 2 segundos.
- **RNF04:** A plataforma deve utilizar um banco de dados relacional para armazenar informações dos restaurantes, pedidos e clientes.
- **RNF05:** O sistema deve garantir a segurança dos dados dos usuários, utilizando autenticação e criptografia de informações sensíveis.
- **RNF06:** A plataforma deve ser escalável para suportar um grande número de usuários simultâneos.
- **RNF07:** A interface deve ser intuitiva e fácil de usar para clientes e administradores.
- **RNF08:** O código deve seguir boas práticas de desenvolvimento, utilizando padrões de arquitetura adequados.
  
## **📌 Link do Trello**  
[![Trello](https://img.shields.io/badge/Trello-0052CC.svg?style=for-the-badge&logo=Trello&logoColor=white)](https://trello.com/invite/b/67b7adafc0ed6c3c8e17412e/ATTIe3356c6837adbe094fa329da7c7425bcDC197814/icibus)  

## **👥 Alunos Responsáveis**  
- **Felipe da Silva Chawischi**  
- **Gabriel Felipe Alves Bandoch**
