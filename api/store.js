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

const USE_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

let kv = null;
if (USE_KV) {
  try {
    kv = require('@vercel/kv').kv;
    console.log('[store] Usando Vercel KV para persistência.');
  } catch (err) {
    console.error('[store] KV configurado mas @vercel/kv indisponível:', err.message);
    kv = null;
  }
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
