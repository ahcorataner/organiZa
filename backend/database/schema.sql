-- ======================
-- Tabela de Usuários
-- ======================
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  perfil_financeiro TEXT CHECK (perfil_financeiro IN ('CONSERVADOR','MODERADO','ARROJADO')),
  idioma TEXT DEFAULT 'pt',
  tema TEXT DEFAULT 'dark',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Usuário padrão para teste
INSERT OR IGNORE INTO usuarios (id, nome, email, senha, perfil_financeiro)
VALUES (1, 'Renata', 'renata@organisa.com', '123456', 'MODERADO');

-- ======================
-- Receitas
-- ======================
CREATE TABLE IF NOT EXISTS receitas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  valor REAL NOT NULL,
  data DATE NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  CONSTRAINT u_receita UNIQUE(usuario_id, data, valor, categoria)
);

-- ======================
-- Despesas
-- ======================
CREATE TABLE IF NOT EXISTS despesas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  valor REAL NOT NULL,
  data DATE NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  CONSTRAINT u_despesa UNIQUE(usuario_id, data, valor, categoria)
);

-- ======================
-- Metas financeiras
-- ======================
CREATE TABLE IF NOT EXISTS metas_financeiras (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  mes_referencia TEXT NOT NULL,
  valor_meta REAL NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ======================
-- Cartões
-- ======================
CREATE TABLE IF NOT EXISTS cartoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  programa_pontos TEXT,
  pontuacao_por_real REAL NOT NULL,
  beneficios TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ======================
-- Investimentos
-- ======================
CREATE TABLE IF NOT EXISTS investimentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  tipo TEXT CHECK(tipo IN ('RENDA_FIXA','RENDA_VARIAVEL')),
  valor_aplicado REAL,
  rendimento_estimado REAL,
  perfil_ideal TEXT CHECK(perfil_ideal IN ('CONSERVADOR','MODERADO','ARROJADO')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ======================
-- Depoimentos
-- ======================
CREATE TABLE IF NOT EXISTS depoimentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  idade INTEGER,
  imagem TEXT,
  relato TEXT NOT NULL,
  data_publicacao DATE
);

INSERT OR IGNORE INTO depoimentos (id, nome, idade, imagem, relato, data_publicacao)
VALUES
(1, 'Carlos', 32, 'assets/carlos.jpg', 'Passei a acompanhar minhas despesas e saí do vermelho.', '2025-01-10'),
(2, 'Juliana', 27, 'assets/juliana.jpg', 'Comecei a investir com segurança e planejar o futuro.', '2025-01-12'),
(3, 'Rafael', 40, 'assets/rafael.jpg', 'Agora tenho visão clara dos cartões e benefícios.', '2025-01-15');

