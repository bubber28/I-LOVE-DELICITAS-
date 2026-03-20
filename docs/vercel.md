# Checklist de Implantacao na Vercel (Frontend)

## Antes do deploy

- [ ] Confirmar Node 20 no ambiente local (`frontend/.nvmrc`).
- [ ] Rodar `npm install` em `frontend/`.
- [ ] Rodar `npm run lint`.
- [ ] Rodar `npm run typecheck`.
- [ ] Rodar `npm run build` e garantir geracao de `dist/`.

## Configuracao na Vercel

- Framework Preset: Vite
- Root Directory: `frontend`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`

## Variaveis de ambiente

Adicionar no projeto da Vercel:

- `VITE_API_URL=https://URL-DA-SUA-API`

## Validacao pos-deploy

- [ ] Home abre sem tela em branco.
- [ ] Rotas da loja carregam (`/catalogo`, `/carrinho`, `/checkout`, etc.).
- [ ] Rotas de admin carregam (`/admin/dashboard`, etc.).
- [ ] Chamadas ao backend apontam para `VITE_API_URL` correta.

## Solucao de problemas

1. Erro de dependencias (ERESOLVE):
   - `frontend/.npmrc` ja inclui `legacy-peer-deps=true`.
   - Rode `npm ci` ou `npm install` novamente.

2. Build falha por versao de Node:
   - Garanta Node 20+ (`engines` no `package.json` do frontend).
   - Em CI, force runtime com Node 20.

3. API nao responde no frontend:
   - Verifique `VITE_API_URL` na Vercel.
   - Confirme CORS habilitado no backend.

4. Rotas front quebram em refresh:
   - Em apps Vite SPA, confirme que o deploy esta servindo `index.html` para rotas de cliente.
