# 🎌 Anime Aggregator

Projeto desenvolvido para a disciplina:

**Projetos supervisionados em Desenvolvimento de software, apps, sites ou hardware [26E1-26E2]**

Trello do projeto:  
`https://trello.com/b/rqv7FWpm/anime-aggregatorprojetos-supervisionados-em-desenvolvimento-de-software-apps-sites-ou-hardware-26e1-26e2`

---

# 👨‍💻 Autor

Marcos Vinícius Souza de Rezende  
Projeto acadêmico – INFNET

---

## 📌 Sobre o Projeto

Este projeto consiste no desenvolvimento de uma plataforma web para agregação e visualização de informações sobre animes, integrando dados provenientes de APIs públicas e open source.

A aplicação está sendo desenvolvida em formato **monorepo**, contendo backend, frontend e infraestrutura, com foco em organização, escalabilidade e boas práticas de desenvolvimento.

Atualmente, o sistema já possui:

- backend funcional com FastAPI
- integração com API externa (Jikan)
- persistência em PostgreSQL
- sistema de favoritos
- histórico de buscas
- camada de cache local com TTL
- autenticação JWT
- fallback legado via `X-User-Email`
- frontend inicial em React + Vite + TypeScript
- execução local totalmente via Docker Compose
- automação de migrations antes da subida da aplicação

A aplicação é composta por:

- Backend em Python com FastAPI
- Frontend em React
- Banco de dados PostgreSQL
- Infraestrutura containerizada com Docker
- Deploy planejado em ambiente AWS (EC2 ou ECS com ALB)

---

## 🏗 Arquitetura

O projeto segue uma arquitetura baseada em serviços e organização por camadas:

```text
anime-aggregator/
│
├── backend/                 # API REST em FastAPI
│   ├── app/
│   │   ├── api/             # Rotas e dependências
│   │   ├── clients/         # Integrações com APIs externas
│   │   ├── core/            # Configurações da aplicação
│   │   ├── database/        # Sessão e base ORM
│   │   ├── models/          # Models SQLAlchemy
│   │   ├── schemas/         # Schemas Pydantic
│   │   └── services/        # Regras de negócio
│   ├── alembic/             # Migrations do banco
│   ├── alembic.ini
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                # Aplicação React + Vite + TypeScript
│   ├── src/
│   │   ├── api/             # Cliente HTTP
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços para consumo da API
│   │   ├── types/           # Tipagens TypeScript
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
├── infra/                   # Infraestrutura como código (futuro)
├── docker-compose.yml
├── smoke-test.sh
└── README.md
```

---

## 🚀 Tecnologias Utilizadas

### Backend
- Python 3.11+
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- httpx
- Pydantic
- PyJWT
- bcrypt
- Swagger/OpenAPI

### Frontend
- React
- Vite
- TypeScript
- React Router DOM
- Axios

### Infraestrutura
- Docker
- Docker Compose
- AWS EC2 ou AWS ECS
- Application Load Balancer (ALB)

### Banco de Dados
- PostgreSQL 16

---

## 🔌 Integrações Externas

O sistema integra APIs públicas de animes, como:

- Jikan API (MyAnimeList)
- Futuramente: AniList GraphQL API

Atualmente, a integração principal implementada é com a **Jikan API**, utilizada para:

- busca de animes
- consulta de detalhes
- listagem de animes populares

---

## ⚙️ Como executar localmente

### Pré-requisitos

- Docker
- Docker Compose

### Subir o ambiente completo

```bash
docker compose up --build -d
```

### Como funciona a inicialização

O `docker-compose` executa automaticamente as migrations antes de subir a API e o frontend, por meio de um serviço dedicado de migração.

Fluxo de inicialização:

1. sobe o PostgreSQL
2. espera o banco ficar saudável
3. executa `alembic upgrade head`
4. sobe a API
5. sobe o frontend

### Acessos locais

- API backend: `http://localhost:8000`
- Swagger/OpenAPI: `http://localhost:8000/docs`
- Frontend: `http://localhost:5173`

### Logs do frontend

```bash
docker compose logs -f frontend
```

### Logs do backend

```bash
docker compose logs -f api
```

### Logs da migration automática

```bash
docker compose logs -f migrate
```

### Executar migrations manualmente (opcional)

```bash
docker exec -it anime_api alembic upgrade head
```

---

## 📚 Funcionalidades Implementadas

### Sprint 1 — Estrutura inicial e integração externa

- estruturação inicial do backend com FastAPI
- configuração do ambiente com Docker Compose
- configuração do PostgreSQL
- integração com a API pública Jikan
- endpoint de health check
- endpoint de busca de animes
- endpoint de consulta de anime por ID
- endpoint de listagem de animes populares
- normalização dos dados externos em formato interno padronizado
- documentação automática via Swagger/OpenAPI

### Sprint 2 — Persistência e funcionalidades do usuário

- configuração de ORM com SQLAlchemy
- controle de migrations com Alembic
- criação da tabela de usuários
- criação da tabela de favoritos
- implementação de criação automática de usuário via header `X-User-Email`
- endpoint para adicionar favoritos
- endpoint para listar favoritos
- endpoint para remover favoritos
- validação de duplicidade de favoritos por usuário
- criação da tabela de histórico de buscas
- registro automático das buscas realizadas
- endpoint para listar histórico de buscas
- endpoint para remover item do histórico

### Sprint 3 — Cache, performance e otimização

- criação da tabela `anime_cache`
- persistência local de dados consultados externamente
- implementação de cache no endpoint de detalhe de anime
- controle de expiração de cache por TTL
- política de cache para reduzir chamadas repetidas à API externa
- retorno do header `X-Cache` com os estados:
  - `MISS` para primeira consulta
  - `HIT` para consultas posteriores dentro do tempo de validade
- atualização da arquitetura para suportar melhor desempenho e resiliência

### Sprint 4 — Frontend e integração com backend

- inicialização do frontend com React + Vite + TypeScript
- execução do frontend via Docker
- configuração de roteamento com React Router DOM
- configuração de cliente HTTP com Axios
- tela inicial com top animes
- tela de busca com paginação
- tela de detalhe do anime
- tela de favoritos
- tela de histórico de buscas
- integração do frontend com o backend
- exibição do status de cache no detalhe do anime
- estrutura inicial de layout e componentes reutilizáveis

### Step 5 — Autenticação e automação da inicialização

- autenticação JWT no backend
- endpoint de registro de usuário
- endpoint de login
- endpoint para obtenção do usuário autenticado
- hash de senha com bcrypt
- geração e validação de token com JWT
- suporte temporário a fallback legado via `X-User-Email`
- automação das migrations no `docker-compose`
- garantia de subida ordenada entre banco, migration, API e frontend

---

## 🔗 Endpoints disponíveis

### Health
- `GET /health`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Animes
- `GET /animes/search?q=&page=&limit=`
- `GET /animes/{id}`
- `GET /animes/top/list?page=&limit=`

### Favoritos
- `POST /favorites`
- `GET /favorites`
- `DELETE /favorites/{favorite_id}`

### Histórico de busca
- `GET /search-history`
- `DELETE /search-history/{history_id}`

---

## 🔐 Autenticação

O backend suporta autenticação baseada em JWT.

### Fluxo principal

1. registrar usuário em `POST /auth/register`
2. realizar login em `POST /auth/login`
3. receber `access_token`
4. enviar token no header:

```http
Authorization: Bearer SEU_TOKEN
```

### Compatibilidade temporária

Enquanto o frontend evolui, o backend ainda aceita o modo legado com:

```http
X-User-Email: email@exemplo.com
```

Esse fallback existe apenas para facilitar a transição para o fluxo completo de autenticação.

---

## 🖥 Funcionalidades do Frontend

O frontend possui as seguintes rotas:

- `/` → página inicial com top animes
- `/search` → busca de animes com paginação
- `/anime/:id` → detalhe do anime
- `/favorites` → listagem de favoritos
- `/history` → histórico de buscas

### Integração com backend

O frontend consome os endpoints do backend usando:

- `VITE_API_BASE_URL`
- `VITE_USER_EMAIL`

Exemplo de `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USER_EMAIL=marcos@local.dev
```

---

## 🧪 Testes

O projeto possui um **smoke test** automatizado para validar o funcionamento da aplicação.

### Executar smoke test

```bash
./smoke-test.sh
```

### Cobertura atual do smoke test

- health check do backend
- disponibilidade do frontend
- registro de usuário
- login com JWT
- validação de `/auth/me`
- busca de animes
- detalhe de anime
- listagem de top animes
- criação de favoritos com JWT
- validação de favorito duplicado
- listagem de favoritos
- remoção de favoritos
- registro de histórico de busca
- remoção de item do histórico
- validação do último termo buscado
- validação do cache com fluxo `MISS` → `HIT`
- validação do fallback legado com `X-User-Email`

---

## 🗄 Banco de Dados

Atualmente, o sistema utiliza PostgreSQL para persistência dos dados da aplicação.

### Entidades implementadas

- `users`
- `favorite_animes`
- `search_history`
- `anime_cache`

### Objetivo da persistência

- armazenar dados do usuário
- registrar favoritos
- manter histórico de buscas
- reduzir chamadas externas por meio de cache local

---

## 📈 Evolução do Projeto

O projeto evoluiu de uma API simples de consumo externo para uma aplicação full stack inicial com:

- arquitetura organizada por camadas
- persistência de dados
- controle de migrations
- funcionalidades próprias do usuário
- otimização com cache local
- autenticação JWT
- frontend integrado ao backend
- testes automatizados do fluxo principal
- execução local totalmente containerizada
- automação de migrations no startup

---

## 🎯 Próximos Passos

### Evoluções previstas

- remover gradualmente o fallback legado `X-User-Email`
- integrar autenticação JWT diretamente no frontend
- proteger rotas do frontend
- refinamento visual da interface
- feedback visual mais robusto para loading e erros
- integração com AniList
- deploy em AWS
- infraestrutura como código
- observabilidade e monitoramento
- melhoria da experiência de usuário no frontend

---

## 📄 Documentação da API

A documentação interativa da API é gerada automaticamente pelo FastAPI e pode ser acessada em:

```text
http://localhost:8000/docs
```

---

## ✅ Status atual

**Projeto em evolução até o Step 5**, contendo:

- backend funcional com integração externa
- persistência de dados
- sistema de favoritos
- histórico de buscas
- cache com TTL
- autenticação JWT
- fallback legado temporário
- migrations com Alembic
- frontend inicial em React
- execução via Docker Compose
- migrations automáticas no startup
- smoke tests automatizados
