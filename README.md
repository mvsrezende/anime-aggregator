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

Atualmente, o sistema já possui um backend funcional com integração externa, persistência de dados, sistema de favoritos, histórico de buscas e camada de cache local.

A aplicação será composta por:

- Backend em Python com FastAPI
- Frontend em React
- Banco de dados PostgreSQL
- Infraestrutura containerizada com Docker
- Deploy em ambiente AWS (EC2 ou ECS com Application Load Balancer)

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
├── frontend/                # Aplicação React (em desenvolvimento)
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
- Swagger/OpenAPI

### Frontend (em desenvolvimento)
- React
- Vite ou Next.js
- Axios ou Fetch API

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

Atualmente, a integração principal implementada é com a **Jikan API**, utilizada para busca, consulta de detalhes e listagem de animes populares.

---

## ⚙️ Como executar localmente

### Pré-requisitos

- Docker
- Docker Compose

### Subir o ambiente

```bash
docker compose up --build -d
```

### Aplicar migrations

```bash
docker exec -it anime_api alembic upgrade head
```

### Acessos locais

- API: `http://localhost:8000`
- Swagger/OpenAPI: `http://localhost:8000/docs`

---

## 📚 Funcionalidades Implementadas

### Sprint 1 — Estrutura inicial e integração externa

- Estruturação inicial do backend com FastAPI
- Configuração do ambiente com Docker Compose
- Configuração do PostgreSQL
- Integração com a API pública Jikan
- Endpoint de health check
- Endpoint de busca de animes
- Endpoint de consulta de anime por ID
- Endpoint de listagem de animes populares
- Normalização dos dados externos em formato interno padronizado
- Documentação automática via Swagger/OpenAPI

### Sprint 2 — Persistência e funcionalidades do usuário

- Configuração de ORM com SQLAlchemy
- Controle de migrations com Alembic
- Criação da tabela de usuários
- Criação da tabela de favoritos
- Implementação de criação automática de usuário via header `X-User-Email`
- Endpoint para adicionar favoritos
- Endpoint para listar favoritos
- Endpoint para remover favoritos
- Validação de duplicidade de favoritos por usuário
- Criação da tabela de histórico de buscas
- Registro automático das buscas realizadas
- Endpoint para listar histórico de buscas
- Endpoint para remover item do histórico

### Sprint 3 — Cache, performance e otimização

- Criação da tabela `anime_cache`
- Persistência local de dados consultados externamente
- Implementação de cache no endpoint de detalhe de anime
- Controle de expiração de cache por TTL
- Política de cache para reduzir chamadas repetidas à API externa
- Retorno do header `X-Cache` com os estados:
  - `MISS` para primeira consulta
  - `HIT` para consultas posteriores dentro do tempo de validade
- Atualização da arquitetura para suportar melhor desempenho e resiliência

---

## 🔗 Endpoints disponíveis

### Health
- `GET /health`

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

## 🧪 Testes

O projeto possui um **smoke test** automatizado para validar o funcionamento do backend de ponta a ponta.

### Executar smoke test

```bash
./smoke-test.sh
```

### Cobertura atual do smoke test

- health check
- busca de animes
- detalhe de anime
- listagem de top animes
- criação de favoritos
- validação de favorito duplicado
- listagem de favoritos
- remoção de favoritos
- registro de histórico de busca
- validação do último termo buscado
- validação do cache com fluxo `MISS` → `HIT`

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

O projeto evoluiu de uma API simples de consumo externo para uma aplicação backend com:

- arquitetura organizada por camadas
- persistência de dados
- controle de migrations
- funcionalidades próprias do usuário
- otimização com cache local
- testes automatizados de fluxo principal

---

## 🎯 Próximos Passos

### Sprint 4 — Frontend

- iniciar a aplicação frontend em React
- criar layout base da interface
- implementar tela de busca
- implementar tela de detalhe do anime
- implementar tela de favoritos
- integrar histórico de buscas no frontend

### Evoluções futuras

- autenticação real com JWT
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

**Backend concluído até a Sprint 3**, contendo:

- integração com API externa
- persistência de dados
- sistema de favoritos
- histórico de buscas
- cache com TTL
- migrations com Alembic
- smoke tests automatizados

Frontend e deploy em nuvem seguem como próximas etapas do projeto.
