# **Icibus - Plataforma de Pedidos Online**  

Icibus é uma **plataforma web de pedidos de comida** que conecta clientes a restaurantes, permitindo que os usuários visualizem menus, façam pedidos, realizem pagamentos simulados e acompanhem o status das entregas. O sistema possui funcionalidades tanto para consumidores quanto para administradores de restaurantes.  

## **📌 Funcionalidades**  
### **Para clientes**  
✅ Visualização de menus e produtos  
✅ Adição de itens ao carrinho  
✅ Simulação de pagamento com informações cadastradas  
✅ Acompanhamento do status do pedido  

### **Para administradores**  
✅ Cadastro e gerenciamento de produtos  
✅ Controle de pedidos recebidos  
✅ Atualização do status das entregas  

## **🛠️ Tecnologias Utilizadas**  
O Icibus foi desenvolvido utilizando as seguintes tecnologias:  

[![Tailwind](https://img.shields.io/badge/TailwindCSS-06B6D4.svg?style=for-the-badge&logo=TailwindCSS&logoColor=white)](https://tailwindcss.com/)  
[![React](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black)](https://reactjs.org/)  
[![Next.js](https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=Next.js&logoColor=white)](https://nextjs.org/)  
[![Clerk](https://img.shields.io/badge/Clerk-000000.svg?style=for-the-badge&logo=Clerk&logoColor=white)](https://clerk.dev/)  
[![Hygraph](https://img.shields.io/badge/Hygraph-1E2A58.svg?style=for-the-badge&logo=Hygraph&logoColor=white)](https://hygraph.com/)

Optamos pelo React.js para construir interfaces dinâmicas e responsivas, garantindo uma experiência fluida para o usuário. O Next.js será utilizado tanto no frontend quanto no backend, permitindo renderização otimizada e a criação de APIs diretamente na aplicação. Para o banco de dados, escolhemos o PostgreSQL por sua robustez e escalabilidade. A autenticação será gerenciada pelo Clerk, que simplifica a implementação de login seguro e controle de acesso. Já o TailwindCSS facilitará a estilização, tornando o desenvolvimento mais ágil e organizado, sem a necessidade de escrever CSS manualmente.

## **📐 Arquitetura do Sistema**  
O Icibus será desenvolvido utilizando uma **arquitetura monolítica** na primeira versão para facilitar o desenvolvimento e implantação inicial. Futuramente, à medida que a plataforma crescer, poderá ser migrada para uma **arquitetura baseada em microsserviços**, permitindo maior escalabilidade e modularização das funcionalidades.  

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
- **RF06:** Os administradores devem poder visualizar os pedidos recebidos.
- **RF07:** O sistema deve permitir que os administradores atualizem o status do pedido (exemplo: "Em preparo", "Saiu para entrega", "Entregue").

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
