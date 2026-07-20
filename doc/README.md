# Catálogo de Premiações Br.ino — Registro de Alterações

## v1.0.9 — Correção da geração de catálogo na Vercel (persistência via Vercel KV)

### Problema relatado
Na Vercel, o sistema **não gerava o catálogo para baixar nem criava a URL
personalizada**, embora o envio do formulário parecesse funcionar.

### Causa raiz
O backend salvava e lia os catálogos gravando arquivos JSON (`data/catalogos.json`
e `data/pedidos.json`). No modelo *serverless* da Vercel o sistema de arquivos é
**somente-leitura**, exceto `/tmp`, que é **efêmero e não é compartilhado entre
invocações**. Consequência:

- O `POST /api/catalogo` até respondia, mas o dado não persistia.
- Ao gerar a URL, o front-end fazia um segundo `fetch` para `/catalogo/:slug/`,
  que rodava em **outra invocação** sem o arquivo → `404`. Isso quebrava tanto o
  **download** (que depende desse fetch) quanto a **URL compartilhável**.

### Solução aplicada
Introduzida uma **camada de armazenamento durável** com **Vercel KV (Redis)** em
produção e *fallback* para arquivos JSON no desenvolvimento local.

Arquivos novos/alterados:

- **`api/store.js`** (novo): camada de persistência. Usa `@vercel/kv` quando as
  variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN` existem; caso contrário grava
  em `data/*.json`. Expõe funções assíncronas: `getCatalog`, `saveCatalog`,
  `getOrders`, `saveOrders`, `deleteOrders`.
- **`api/app.js`** (novo): aplicação Express compartilhada, com as rotas agora
  assíncronas usando o `store`. Elimina a duplicação que existia entre
  `server.js` e `api/index.js`.
- **`api/index.js`**: reduzido a um *wrapper* serverless fino que importa `app.js`.
- **`server.js`**: reduzido a um *listener* local que importa a mesma `app.js`
  (paridade total entre local e produção).
- **`package.json`**: adicionada a dependência `@vercel/kv`.
- **`.gitignore`**: ignora `.env*.local`, `.vercel` e arquivo temporário de teste.

### Melhoria extra
O `POST /api/catalogo` agora **retorna o HTML já renderizado** no campo `html` da
resposta. Isso torna o download mais robusto por não depender de uma segunda
requisição de rede. (O front-end atual continua funcionando; pode passar a usar
esse campo diretamente numa próxima iteração.)

### Layout
Nenhuma mudança visual. O template continua sendo `views/catalogo.html`, seguindo
o padrão de `docs/GERADO_1.HTM`.

---

## Como configurar o Vercel KV (necessário para produção)

1. No painel da Vercel, abra o projeto → aba **Storage** → **Create Database** →
   **KV** (Upstash Redis). Dê um nome e conecte ao projeto.
2. A Vercel injeta automaticamente as variáveis de ambiente
   `KV_REST_API_URL` e `KV_REST_API_TOKEN` (entre outras) no projeto.
3. Faça um novo **deploy**. Pronto: catálogos e pedidos passam a persistir.

Sem essas variáveis, o app roda em modo arquivo (apenas para desenvolvimento
local, `npm start`), que **não funciona em produção serverless**.

### Desenvolvimento local
```bash
npm install
npm run dev     # compila o TypeScript e sobe o servidor em http://localhost:3000
```
Localmente, sem KV, os dados vão para `data/*.json`. Para testar contra o KV
localmente, crie um arquivo `.env.local` com `KV_REST_API_URL` e
`KV_REST_API_TOKEN`.

### Teste de fumaça executado
- `POST /api/catalogo` → `200`, retornando `slug`, `url` e `html`.
- `GET /catalogo/:slug/` → `200` (página renderizada).
- `POST /api/orders` + `GET /api/orders/:slug` → registro e leitura de pedidos OK.
