
<p align="center">
  <img src="frontend/assets/LOGO.png" alt="Organi$a Logo" width="160" style="border-radius:16px;">
</p>

<h1 align="center">💸 ORGANI$A 💸</h1>
<h3 align="center">Sistema Web de Controle Financeiro Pessoal</h3>

<p align="center">
  🏛️ UFMA | 💻 Desenvolvimento de Sistemas Web (DSW) | 🧩 Entrega 2 – Desenvolvimento Parcial
</p>

---

## 📝 Informações do Sistema

| Item | Detalhe |
|------|---------|
| **Nome do Sistema** | ORGANI$A – Controle Financeiro Pessoal |
| **Curso** | Engenharia da Computação |
| **Universidade** | Universidade Federal do Maranhão |
| **Disciplina** | Desenvolvimento de Sistemas WEB |
| **Aluno(a)** | Renata Costa Rocha |
| **Matrícula** | 20240001556 |

---

## 📌 Descrição do Projeto

O **ORGANI$A** é uma aplicação web desenvolvida para auxiliar usuários no **controle financeiro pessoal,** permitindo o gerenciamento de **receitas e despesas,** análise de indicadores financeiros e visualização de dados por meio de **gráficos interativos.**

Nesta **Entrega 2,** o projeto evoluiu de um protótipo estático para uma **aplicação web dinâmica,** com **backend funcional,** **integração frontend-backend,** **autenticação de usuários** e **persistência de dados,** conforme definido no PRD da Entrega 1.

---

## 🚀 Funcionalidades do Sistema

### ✅ Funcionalidades Implementadas (Entrega 2)
- Sistema de autenticação (login e logout)
- Controle de acesso ao dashboard
- CRUD completo de **receitas**
- CRUD completo de **despesas**
- Integração frontend-backend via API REST
- Persistência de dados com banco de dados
- Dashboard financeiro com métricas
- Gráficos interativos:
  - Receitas x despesas
  - Despesas por categoria
  - Evolução do saldo
- Tema **dark/light**
- Idioma **português / inglês**
- Navegação funcional entre telas

### 🚧 Funcionalidades Não Implementadas Nesta Entrega
- Cadastro de novos usuários
- Alertas automáticos de endividamento
- Integração com bolsas de valores
- Versão mobile da aplicação

---

## 🛠 Tecnologias Utilizadas

### Frontend
- HTML5 semântico  
- CSS3  
- Tailwind CSS  
- JavaScript (ES6)  
- Chart.js  

### Backend
- Node.js  
- Express.js  

### Banco de Dados
- SQLite  

> Escolhido pela simplicidade de configuração e adequação ao escopo acadêmico do projeto.

---

## 🎨 Tecnologias & Badges

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-0D1117?style=for-the-badge&logo=html5&logoColor=E34F26">
  <img src="https://img.shields.io/badge/CSS3-0D1117?style=for-the-badge&logo=css3&logoColor=1572B6">
  <img src="https://img.shields.io/badge/JavaScript-0D1117?style=for-the-badge&logo=javascript&logoColor=F7DF1E">
  <img src="https://img.shields.io/badge/TailwindCSS-0D1117?style=for-the-badge&logo=tailwind-css&logoColor=06B6D4">
  <img src="https://img.shields.io/badge/Chart.js-0D1117?style=for-the-badge&logo=chartdotjs&logoColor=FF6384">
  <img src="https://img.shields.io/badge/Node.js-0D1117?style=for-the-badge&logo=node.js&logoColor=339933">
</p>

---

## 📂 Estrutura do Projeto

```text
ORGANI$A/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── package.json
│   └── server.js
│
├── database/
│   ├── organisa.db
│   └── organisa.txt
│
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── login.html
│   └── prints/
│
├── dev-tests/
├── .gitignore
└── README.md
````

---

## ⚙️ Pré-requisitos

* Node.js (versão 18 ou superior)
* npm
* Navegador web moderno

---

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/ahcorataner/organisa.git
```

2. Acesse a pasta do backend:

```bash
cd backend
```

3. Instale as dependências:

```bash
npm install
```

---

## ▶️ Execução

```bash
npm start
```

* **Backend:** [http://localhost:3000](http://localhost:3000)
* **Frontend:** abrir `frontend/index.html` no navegador

---

## 🚀 Instruções de Navegação

1. Abra **index.html** em qualquer navegador moderno
2. Realize o **login** para acessar o sistema
3. Utilize o menu lateral para acessar:

   * 📊 Dashboard
   * 🏦 Minhas Contas
   * 💳Cartões
   * 🔄 Lançamentos
   * 📈 Relatórios
   * ⚙️ Configurações
4. Teste filtros e barra de pesquisa no Dashboard
5. Utilize os seletores no topo para alternar:

   * 🌙 Tema (dark / light)
   * 🌍 Idioma (pt / en)

---

## ⚠️ Lista de Páginas Rompidas

> Todos os botões estão previstos para gerar páginas funcionais.

✔ Nenhum link está quebrado
ℹ️ Algumas páginas ainda estão planejadas para versões futuras

---

## 🔗 Rotas / Endpoints da API

### 🔐 Autenticação
- **POST** `/api/auth/login`

### 💰 Receitas
- **GET** `/api/receitas`
- **POST** `/api/receitas`
- **PUT** `/api/receitas/:id`
- **DELETE** `/api/receitas/:id`

### 💸 Despesas
- **GET** `/api/despesas`
- **POST** `/api/despesas`
- **PUT** `/api/despesas/:id`
- **DELETE** `/api/despesas/:id`
`/api/despesas/:id`

---

## 🖼 Capturas de Tela

Localizadas em `frontend/prints/`:

* Tela de Login
* Dashboard Principal
* Inclusão de Receita
* Edição de Receita
* Tema Claro

---

## 🧩 Diagrama de Arquitetura (Textual)

```text
Usuário
  │
  ▼
Frontend (HTML | CSS | JavaScript | Chart.js)
  │
  │ Fetch API
  ▼
Backend (Node.js | Express)
  │
  ▼
Banco de Dados (SQLite)
```

## ✅ Validação de Formulários

O sistema possui **validação de dados de entrada** tanto no **frontend** quanto no **backend**, garantindo a integridade das informações e prevenindo erros durante as operações.

### 🔹 Validação no Frontend
- Campos obrigatórios definidos nos formulários (ex.: descrição, valor e data)
- Verificação de campos vazios antes do envio
- Tipos de dados adequados (ex.: campos numéricos para valores)
- Feedback visual ao usuário em caso de dados inválidos

### 🔹 Validação no Backend
- Verificação da presença dos campos obrigatórios nas requisições
- Tratamento de requisições inválidas
- Retorno de mensagens de erro apropriadas com códigos HTTP
- Prevenção de operações inconsistentes no banco de dados

Essas validações garantem maior confiabilidade ao sistema e atendem ao requisito de **validação de formulários** exigido na Entrega 2.

---

## 🔐 Sistema de Sessão e Controle de Acesso

O sistema implementa **controle de acesso baseado em sessão**, garantindo que apenas usuários autenticados possam acessar as funcionalidades protegidas.

- Após o login bem-sucedido, as informações do usuário são armazenadas no `localStorage`
- O acesso ao dashboard é validado a cada carregamento da aplicação
- Usuários não autenticados são automaticamente redirecionados para a tela de login
- O logout remove os dados da sessão, encerrando o acesso às áreas protegidas

Esse mecanismo assegura a proteção das rotas no frontend e atende ao requisito de **controle de acesso** da Entrega 2.

---

## 🔗 Integração Frontend-Backend

A aplicação possui **integração funcional entre frontend e backend**, utilizando comunicação via **API REST**.

- O frontend realiza requisições HTTP utilizando a **Fetch API**
- O backend processa requisições nos métodos `GET`, `POST`, `PUT` e `DELETE`
- As respostas são trocadas no formato **JSON**
- O fluxo garante sincronização entre interface e persistência de dados

Essa integração permite que as ações do usuário no frontend sejam refletidas corretamente no backend.

---

## 💾 Persistência de Dados

O sistema utiliza **persistência de dados em banco de dados**, garantindo que as informações sejam mantidas mesmo após o encerramento da aplicação.

- Banco de dados utilizado: **SQLite**
- Armazenamento de receitas, despesas e informações relacionadas
- Operações de criação, leitura, atualização e exclusão refletem diretamente no banco
- A persistência assegura confiabilidade e integridade das informações

Essa abordagem atende ao requisito de **persistência de dados** definido para a Entrega 2.

---

## 🛠 Dificuldades Encontradas e Soluções

* **Conflito entre rotas do frontend e backend**
  ✔ Solução: padronização das rotas `/api/*`

* **Problemas de renderização de gráficos ao alternar tema**
  ✔ Solução: centralização da lógica de tema e gráficos

* **Código duplicado no JavaScript**
  ✔ Solução: refatoração e unificação das funções

---

## 🔗 Validações

* ✅ **HTML:** [Validador W3C](https://validator.w3.org/check?uri=referer)
* ✅ **CSS:** [Validador W3C](https://jigsaw.w3.org/css-validator/check/referer)

---

[![GitHub Project](https://img.shields.io/badge/📋%20GitHub%20Project-Organi%24a-blue?style=for-the-badge)](https://github.com/users/ahcorataner/projects/2/views/1)

---

## 📬 Contato

* 🧑‍💻 GitHub: [@ahcorataner](https://github.com/ahcorataner)
* 📧 E-mail: [renata.rocha@discente.ufma.br](mailto:renata.rocha@discente.ufma.br)

---

