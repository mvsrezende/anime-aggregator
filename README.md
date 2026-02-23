
# 🎌 Anime Aggregator

Projeto desenvolvido para a disciplina:

**Projetos supervisionados em Desenvolvimento de software, apps, sites ou hardware [26E1-26E2]**

# 👨‍💻 Autor

Marcos Vinícius Souza de Rezende  
Projeto acadêmico – INFNET

---

## 📌 Sobre o Projeto

Este projeto consiste no desenvolvimento de uma plataforma web para agregação e visualização de informações sobre animes, integrando dados provenientes de APIs públicas e open source.

A aplicação será composta por:

- Backend em Python com FastAPI
- Frontend em React
- Banco de dados PostgreSQL
- Infraestrutura containerizada com Docker
- Deploy em ambiente AWS (EC2 ou ECS com Application Load Balancer)

---

## 🏗 Arquitetura

O projeto segue uma arquitetura baseada em serviços:

```
anime-aggregator/
│
├── backend/        # API REST em FastAPI
├── frontend/       # Aplicação React
├── infra/          # Infraestrutura como código (futuro)
├── docker-compose.yml
└── README.md
```

---

## 🚀 Tecnologias Utilizadas

### Backend
- Python 3.11+
- FastAPI
- SQLAlchemy
- PostgreSQL
- httpx
- Swagger/OpenAPI (documentação automática)

### Frontend (em desenvolvimento)
- React
- Vite ou Next.js
- Axios ou Fetch API

### Infraestrutura
- Docker
- Docker Compose
- AWS EC2 ou AWS ECS
- Application Load Balancer (ALB)

---

## 🔌 Integrações Externas

O sistema integra APIs públicas de animes, como:

- Jikan API (MyAnimeList)
- (Futuramente) AniList GraphQL API

---

## ⚙️ Como executar localmente

### Pré-requisitos
- Docker
- Docker Compose

### Subir o ambiente

```bash
docker compose up --build
```

A aplicação ficará disponível em:

- API: http://localhost:8000
- Documentação Swagger: http://localhost:8000/docs

---

## 📚 Funcionalidades Implementadas (Sprint 1)

- Estruturação do backend
- Integração com API pública (Jikan)
- Endpoint de busca de animes
- Endpoint de detalhes por ID
- Endpoint de listagem de animes populares
- Normalização de dados externos
- Containerização com Docker
- Configuração de banco PostgreSQL

---

## 🎯 Próximos Passos

- Persistência de dados no banco
- Implementação de favoritos
- Implementação de cache
- Desenvolvimento do frontend
- Deploy em ambiente AWS
