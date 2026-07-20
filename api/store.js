/**
 * Camada de armazenamento (storage) do Catálogo de Premiações Br.ino.
 *
 * Estratégia dual:
 *  - Em produção na Vercel usamos Vercel KV (Redis via @vercel/kv), pois o
 *    sistema de arquivos serverless é somente-leitura e o /tmp é efêmero,
 *    não compartilhado entre invocações.
 *  - Em desenvolvimento local (ou se o KV não estiver configurado) caímos
 *    de volta para arquivos JSON em /data, preservando o fluxo antigo.
 *
 * O backend consome apenas as funções async exportadas aqui, sem saber
 * qual backend está ativo.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const ON_VERCEL = !!process.env.VERCEL;

// Em desenvolvimento local, carrega variáveis de um .env.local (fora do git).
// Na Vercel, as variáveis já são injetadas pela integração — dotenv é ignorado.
if (!ON_VERCEL) {
  try {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
    require('dotenv').config();
  } catch (_) { /* dotenv é opcional */ }
}

/**
 * Descobre as credenciais REST do KV/Upstash aceitando:
 *  - nomes padrão: KV_REST_API_URL / KV_REST_API_TOKEN
 *  - nomes Upstash: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 *  - qualquer PREFIXO customizado da Vercel, ex.:
 *      meuprefixo_KV_REST_API_URL / meuprefixo_KV_REST_API_TOKEN
 * Assim funciona independentemente do prefixo escolhido no painel.
 */
function findKvCreds() {
  const e = process.env;
  if (e.KV_REST_API_URL && e.KV_REST_API_TOKEN) {
    return { url: e.KV_REST_API_URL, token: e.KV_REST_API_TOKEN };
  }
  if (e.UPSTASH_REDIS_REST_URL && e.UPSTASH_REDIS_REST_TOKEN) {
    return { url: e.UPSTASH_REDIS_REST_URL, token: e.UPSTASH_REDIS_REST_TOKEN };
  }
  // Procura pares com prefixo customizado
  for (const suffix of ['_KV_REST_API_URL', '_UPSTASH_REDIS_REST_URL']) {
    const urlKey = Object.keys(e).find(k => k.endsWith(suffix) && e[k]);
    if (urlKey) {
      const prefix = urlKey.slice(0, urlKey.length - suffix.length);
      const tokenSuffix = suffix.replace('_URL', '_TOKEN');
      const tokenKey = prefix + tokenSuffix;
      if (e[tokenKey]) return { url: e[urlKey], token: e[tokenKey] };
    }
  }
  return null;
}

let kv = null;
const creds = findKvCreds();
if (creds) {
  try {
    const { createClient } = require('@vercel/kv');
    kv = createClient({ url: creds.url, token: creds.token });
    console.log('[store] Usando Vercel KV/Upstash para persistência.');
  } catch (err) {
    console.error('[store] KV configurado mas @vercel/kv indisponível:', err.message);
    kv = null;
  }
} else if (ON_VERCEL) {
  console.error('[store] ATENÇÃO: rodando na Vercel SEM KV detectado. ' +
    'Conecte o banco Redis (Upstash) ao projeto e faça redeploy.');
}

/* ------------------------------------------------------------------ */
/*  Backend de arquivo (fallback local)                                */
/* ------------------------------------------------------------------ */

const ROOT_DATA_DIR = path.join(__dirname, '..', 'data');

function resolveDataDir() {
  try {
    fs.mkdirSync(ROOT_DATA_DIR, { recursive: true });
    return ROOT_DATA_DIR;
  } catch (err) {
    const tmp = path.join(process.env.TMPDIR || process.env.TEMP || os.tmpdir(), 'brino-data');
    try { fs.mkdirSync(tmp, { recursive: true }); } catch (_) {}
    return tmp;
  }
}

const DATA_DIR = kv ? null : resolveDataDir();
const CATALOGS_FILE = DATA_DIR ? path.join(DATA_DIR, 'catalogos.json') : null;
const ORDERS_FILE = DATA_DIR ? path.join(DATA_DIR, 'pedidos.json') : null;

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return {};
  }
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

/* ------------------------------------------------------------------ */
/*  API pública (async)                                                */
/* ------------------------------------------------------------------ */

async function getCatalog(slug) {
  if (kv) {
    return (await kv.get(`catalog:${slug}`)) || null;
  }
  const all = readJson(CATALOGS_FILE);
  return all[slug] || null;
}

async function saveCatalog(slug, config) {
  if (kv) {
    await kv.set(`catalog:${slug}`, config);
    return;
  }
  const all = readJson(CATALOGS_FILE);
  all[slug] = config;
  writeJson(CATALOGS_FILE, all);
}

async function getOrders(slug) {
  if (kv) {
    return (await kv.get(`orders:${slug}`)) || [];
  }
  const all = readJson(ORDERS_FILE);
  return all[slug] || [];
}

async function saveOrders(slug, list) {
  if (kv) {
    await kv.set(`orders:${slug}`, list);
    return;
  }
  const all = readJson(ORDERS_FILE);
  all[slug] = list;
  writeJson(ORDERS_FILE, all);
}

async function deleteOrders(slug) {
  if (kv) {
    await kv.del(`orders:${slug}`);
    return;
  }
  const all = readJson(ORDERS_FILE);
  if (all[slug]) {
    delete all[slug];
    writeJson(ORDERS_FILE, all);
  }
}

module.exports = {
  backend: kv ? 'kv' : 'file',
  getCatalog,
  saveCatalog,
  getOrders,
  saveOrders,
  deleteOrders,
};
