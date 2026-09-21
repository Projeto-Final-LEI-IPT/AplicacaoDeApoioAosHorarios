# Aplicação de Apoio aos Horários
Projeto Final — Instituto Politécnico de Tomar  
23306 Ricardo Marques

## Tecnologias
- **Frontend:** React + TypeScript + Vite
- **Backend:** NestJS + TypeScript
- **Base de dados:** PostgreSQL + Prisma
- **Tempo real:** Socket.io
- **Infraestrutura:** Docker

## Como correr o projeto

### 1. Instalar dependências
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configurar variáveis de ambiente
Copiar `backend/.env.example` para `backend/.env` e ajustar os valores se necessário (os valores por omissão já correspondem ao `docker-compose.yaml` desta raiz):
```bash
cd backend
cp .env.example .env
```

### 3. Iniciar a base de dados (requer Docker)
```bash
docker-compose up -d
```

### 4. Aplicar as migrações à base de dados
```bash
cd backend
npx prisma migrate deploy
```

### 5. Correr tudo de uma vez (backend + frontend + Prisma Studio)
Na raiz do projeto:
```bash
npm run dev
```

Ou, individualmente:

**Backend**
```bash
cd backend
npm run start:dev
```

**Frontend**
```bash
cd frontend
npm run dev
```

**Prisma Studio (Ambiente gráfico)**
```bash
cd backend
npx prisma studio
```

## Acessos locais
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Prisma Studio: http://localhost:5555
