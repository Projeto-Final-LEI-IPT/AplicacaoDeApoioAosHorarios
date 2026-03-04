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

### 1. Iniciar a base de dados
```bash
docker-compose up -d
```

### 2. Iniciar o backend
```bash
cd backend
npm run start:dev
```

### 3. Iniciar o frontend
```bash
cd frontend
npm run dev
```

### 4. Prisma Studio (Ambiente gráico)
```bash
cd backend
npx prisma studio
```

## Acessos locais
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Prisma Studio: http://localhost:5555
