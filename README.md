# software-challenge-clarifiquei

## Configuração das variáveis de ambiente

### Backend - `.env`

Crie um arquivo `.env` dentro da pasta `backend` com o seguinte conteúdo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=postgres
```

> Ajuste conforme o seu ambiente PostgreSQL.

---

### Frontend - `.env`

Crie um arquivo `.env` dentro da pasta `frontend` com o seguinte conteúdo:

```env
REACT_APP_API_URL=http://localhost:3200
```

---

## Como rodar o banco

O script de criação do banco já está no repositório.

1. Acesse seu PostgreSQL .
2. Execute o script SQL disponível no projeto para criar as tabelas e tipos necessários.

---
