# I-LOVE-DELICITAS Monorepo

Monorepo reconstruido do zero com:

- `frontend/`: Vite + React 18 + TypeScript, pronto para deploy na Vercel.
- `backend/`: Node 20 + TypeScript + Express com rotas mock e preparacao para JWT.

## Requisitos

- Node.js 20+
- npm 10+

## Estrutura

- `frontend/`
- `backend/`
- `docs/vercel.md`

## Frontend (local)

1. Entrar na pasta:

```bash
cd frontend
```

2. Instalar dependencias:

```bash
npm install
```

3. Rodar em desenvolvimento:

```bash
npm run dev
```

4. Validar qualidade/tipos:

```bash
npm run lint
npm run typecheck
```

5. Build de producao:

```bash
npm run build
```

6. Preview do build local:

```bash
npm run preview
```

### Variaveis de ambiente do frontend

Arquivo `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:3333
```

## Backend (local)

1. Entrar na pasta:

```bash
cd backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Rodar em desenvolvimento:

```bash
npm run dev
```

4. Validar tipos:

```bash
npm run typecheck
```

5. Build:

```bash
npm run build
```

6. Rodar build gerado:

```bash
npm run start
```

### Variaveis de ambiente do backend

Arquivo `backend/.env.example`:

```env
PORT=3333
JWT_SECRET=troque-esta-chave-em-producao
```

## Rotas mock da API

- `GET /health`
- `POST /auth/login`
- `GET /catalog/categories`
- `GET /catalog/products`
- `POST /orders` (protegida por token)

## Deploy do frontend na Vercel

Configurar projeto na Vercel com:

- Diretorio raiz: `frontend`
- Comando de instalacao: `npm ci`
- Comando de build: `npm run build`
- Diretorio de saida: `dist`

Variavel de ambiente recomendada:

- `VITE_API_URL=https://SUA-API`

Guia completo: `docs/vercel.md`