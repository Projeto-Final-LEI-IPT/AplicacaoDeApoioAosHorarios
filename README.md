# Aplicação de Apoio aos Horários
Projeto Final — Instituto Politécnico de Tomar  
23306 Ricardo Marques

## Tecnologias
- **Frontend:** React + TypeScript + Vite
- **Backend:** NestJS + TypeScript
- **Base de dados:** PostgreSQL + Prisma
- **Tempo real:** Socket.io
- **Infraestrutura:** Docker

## Pré-requisitos
- Node.js e npm
- Docker (para a base de dados PostgreSQL)


## Como correr o projeto

### 0. Obter o código
```bash
git clone https://github.com/RicMFM/AplicacaoDeApoioAosHorarios.git
cd AplicacaoDeApoioAosHorarios
```

### 1. Instalar dependências (na raiz do projeto)
```bash
npm install
cd backend
npm install
cd ../frontend
npm install
cd ..
```

### 2. Configurar variáveis de ambiente
Copiar `backend/.env.example` para `backend/.env`:
```bash
cd backend
copy .env.example .env
cd ..
```

Os valores por omissão já correspondem ao `docker-compose.yaml` da raiz do projeto. **Antes de continuar, alterar o valor de `SEED_ADMIN_PASSWORD`** no `.env`: é a password do utilizador administrador criado no passo 5.

### 3. Iniciar a base de dados (na raiz do projeto, requer Docker)
```bash
docker-compose up -d
```

### 4. Gerar o cliente Prisma e aplicar as migrações
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

### 5. Criar o utilizador ADMIN inicial
Ainda na pasta `backend`:
```bash
npx prisma db seed
cd ..
```
Cria o utilizador `admin@ipt.pt`, com a password definida em `SEED_ADMIN_PASSWORD` no `.env`. Se não tiver sido alterada, a password é a que vem no `.env.example` (`define-uma-password-forte-aqui`).

Nota: o seed só cria o utilizador. Se o `admin@ipt.pt` já existir, o comando dá erro e a password não é alterada.

### 6. Correr a aplicação (na raiz do projeto)
```bash
npm run dev
```
Este comando inicia a base de dados (Docker), o backend, o frontend e o Prisma Studio em simultâneo.

Também é possível correr cada parte individualmente:

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

**Prisma Studio (ambiente gráfico da base de dados)**
```bash
cd backend
npx prisma studio
```

## Acessos locais
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Prisma Studio: http://localhost:5555
