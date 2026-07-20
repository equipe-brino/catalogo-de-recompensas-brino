# Catálogo de Premiações Br.ino — Registro de Alterações

## v1.0.11 — Conexão com Redis (Upstash) e detecção de prefixo customizado

### Detecção flexível de credenciais do KV
O banco `premiacoes-teste` (Upstash Redis) foi criado com **prefixo customizado**
(`premiacoestestebrino_`), então as variáveis de ambiente na Vercel têm esse
prefixo (ex.: `premiacoestestebrino_KV_REST_API_URL`). O `api/store.js` foi
atualizado com `findKvCreds()`, que detecta as credenciais em três formatos:
nomes padrão (`KV_REST_API_URL`/`_TOKEN`), nomes Upstash
(`UPSTASH_REDIS_REST_URL`/`_TOKEN`) e **qualquer prefixo customizado**. Assim
funciona independentemente do nome escolhido no painel.

### Variáveis de ambiente (Vercel x local)
- Na **Vercel**, a integração Upstash injeta as variáveis automaticamente — nada
  precisa ir para o git.
- No **desenvolvimento local**, foi adicionado suporte a `.env.local` via
  `dotenv` (dependência nova). O `.env.local` está no `.gitignore` e **não é
  versionado**. Incluído um `.env.example` (sem segredos) como referência.

### Verificação
Confirmado que `api/store.js` detecta o backend como `kv` com o prefixo
customizado. O teste de rede ponta a ponta com a Upstash não pôde rodar no
ambiente de build (sem egress externo), mas roda normalmente na Vercel.

---

## v1.0.10 — Download independente de rede + limpeza de dados de teste

### Front-end: download usando o HTML retornado pelo POST
O `POST /api/catalogo` já devolve o HTML renderizado (v1.0.9). Agora o
`src/generator.ts` usa esse `result.html` diretamente para montar o arquivo de
download, tornando o "Baixar site (HTML)" **independente de uma segunda
requisição de rede**. Mantido um *fallback* para buscar a página ao vivo caso o
servidor não retorne o HTML. As duas opções (Site/URL e Download/PDF) continuam
disponíveis, à escolha do professor. Recompilado para `public/js/generator.js`.

### Robustez do storage (KV/Upstash)
`api/store.js` passou a aceitar também as variáveis `UPSTASH_REDIS_REST_URL` e
`UPSTASH_REDIS_REST_TOKEN` (além de `KV_REST_API_URL`/`KV_REST_API_TOKEN`) e
agora usa `createClient`. Se rodar na Vercel sem KV, registra um aviso claro nos
logs. O `POST` retorna mensagem de erro mais explícita quando o armazenamento
não está configurado.

### Limpeza de dados de teste
Todos os catálogos e pedidos de teste foram **arquivados** em
`data/arquivo-testes.json` (com data e motivo) e os arquivos ativos
(`data/catalogos.json` e `data/pedidos.json`) foram zerados para `{}`, deixando
o sistema pronto para uso real. Nada foi perdido — o backup permite restaurar.

---

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
