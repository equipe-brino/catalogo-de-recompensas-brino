/**
 * Aplicação Express compartilhada do Catálogo de Premiações Br.ino.
 *
 * Este módulo exporta a instância `app` configurada e é consumido por:
 *  - api/index.js  -> handler serverless para a Vercel
 *  - server.js     -> servidor local (app.listen)
 *
 * A persistência é delegada a ./store, que usa Vercel KV em produção e
 * arquivos JSON localmente. Assim o mesmo código roda igual nos dois lados.
 */

const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const store = require('./store');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const VIEWS_DIR = path.join(__dirname, '..', 'views');

app.use(express.static(PUBLIC_DIR));

/* ------------------------------------------------------------------ */
/*  Diretório de uploads (best-effort; na Vercel cai para inline)      */
/* ------------------------------------------------------------------ */

const ROOT_UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads');
const UPLOAD_DIR = (() => {
  try {
    fs.mkdirSync(ROOT_UPLOAD_DIR, { recursive: true });
    return ROOT_UPLOAD_DIR;
  } catch (err) {
    return path.join(process.env.TMPDIR || process.env.TEMP || os.tmpdir(), 'brino-uploads');
  }
})();
app.use('/uploads', express.static(UPLOAD_DIR));

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Salva um data URL base64 em /uploads. Se o filesystem for somente-leitura
 * (Vercel), a exceção é capturada e devolvemos o próprio data URL, que é
 * então armazenado inline no catálogo — mantendo a imagem funcional.
 */
function saveBase64File(dataUrl, prefix) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return dataUrl;
  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return dataUrl;

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    let ext = 'bin';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('svg')) ext = 'svg';
    else if (mimeType.includes('pdf')) ext = 'pdf';
    else if (mimeType.includes('octet-stream')) ext = 'stl';

    const filename = `${prefix}-${crypto.randomBytes(8).toString('hex')}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error saving base64 file (mantendo inline):', err.message);
    return dataUrl;
  }
}

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function renderCatalogPage(config) {
  const templatePath = path.join(VIEWS_DIR, 'catalogo.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error('Template de catálogo ausente no servidor.');
  }

  const html = fs.readFileSync(templatePath, 'utf8');
  const modeSubtitle = {
    loja: 'Junte seus pontos e escolha o prêmio que mais combina com você!',
    podio: 'Parabéns aos destaques da turma! 🎉',
    trilha: 'Desenvolva cada habilidade e desbloqueie um prêmio.'
  }[config.mode] || 'Recompensas para a sua turma';

  const modeTitle = {
    loja: 'Escolha seu prêmio',
    podio: 'Premiação da turma',
    trilha: 'Sua trilha de conquistas'
  }[config.mode] || 'Catálogo';

  const configJson = JSON.stringify(config)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');

  return html
    .replace(/\{\{title\}\}/g, escapeHtml(config.title || 'Catálogo de Recompensas'))
    .replace(/\{\{subtitle\}\}/g, escapeHtml(modeSubtitle))
    .replace(/\{\{teacher\}\}/g, escapeHtml(config.teacher || ''))
    .replace(/\{\{klass\}\}/g, escapeHtml(config.klass || ''))
    .replace(/\{\{school\}\}/g, escapeHtml(config.school || ''))
    .replace(/\{\{modeTitle\}\}/g, escapeHtml(modeTitle))
    .replace(/\{\{configJson\}\}/g, configJson);
}

/* ------------------------------------------------------------------ */
/*  Rotas                                                              */
/* ------------------------------------------------------------------ */

app.get('/', (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'Base.html'));
});

// GET /api/catalogo/:customer -> JSON do catálogo
app.get('/api/catalogo/:customer', async (req, res) => {
  try {
    const slug = slugify(req.params.customer);
    const config = await store.getCatalog(slug);
    if (!config) return res.status(404).json({ error: 'Catálogo não encontrado' });
    res.json(config);
  } catch (err) {
    console.error('Error reading catalog:', err);
    res.status(500).json({ error: 'Erro ao ler catálogo' });
  }
});

// POST /api/catalogo -> cria/atualiza catálogo
app.post('/api/catalogo', async (req, res) => {
  try {
    const config = req.body;

    if (!config.teacher || !config.klass || !config.school) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes (professor, turma, escola)' });
    }

    let requestedSlug = slugify(config.slug || `${config.teacher}-${config.klass}-${config.school}`);
    if (!requestedSlug) requestedSlug = 'catalogo';

    if (Array.isArray(config.items)) {
      config.items = config.items.map((item, index) => {
        item.link = item.link ? String(item.link).trim() : undefined;
        if (item.img && item.img.startsWith('data:')) {
          item.img = saveBase64File(item.img, `img-prize-${index}`);
        }
        if (item.file && item.file.data && item.file.data.startsWith('data:')) {
          item.file.data = saveBase64File(item.file.data, `file-prize-${index}`);
        }
        return item;
      });
    }

    // Resolve colisão de slug entre professores diferentes
    let finalSlug = requestedSlug;
    let attempts = 0;
    while (attempts < 100) {
      const existing = await store.getCatalog(finalSlug);
      if (!existing || existing.teacher === config.teacher) break;
      attempts++;
      finalSlug = `${requestedSlug}-${attempts}`;
    }

    config.slug = finalSlug;
    config.updatedAt = new Date().toISOString();

    await store.saveCatalog(finalSlug, config);

    // Renderiza a página já aqui: torna o download robusto (não depende de
    // uma segunda requisição para /catalogo/:slug).
    let html = null;
    try {
      html = renderCatalogPage(config);
    } catch (e) {
      console.error('Falha ao pré-renderizar HTML:', e.message);
    }

    res.json({ success: true, slug: finalSlug, url: `/catalogo/${finalSlug}/`, html });
  } catch (err) {
    console.error('Error creating catalog:', err);
    res.status(500).json({ error: 'Erro ao salvar catálogo' });
  }
});

// GET /catalogo/:customer[/] -> página HTML dinâmica
app.get(['/catalogo/:customer', '/catalogo/:customer/'], async (req, res) => {
  try {
    const slug = slugify(req.params.customer);
    const config = await store.getCatalog(slug);

    if (!config) {
      return res.status(404).send('<h1>Catálogo não encontrado</h1><p>Verifique o link ou crie um novo catálogo.</p>');
    }

    res.send(renderCatalogPage(config));
  } catch (err) {
    console.error('Error rendering catalog:', err);
    res.status(500).send('Erro interno do servidor ao renderizar o catálogo.');
  }
});

/* -------------------------- Pedidos (alunos) ---------------------- */

app.post('/api/orders', async (req, res) => {
  try {
    const { slug, studentName, prizeName, skillName } = req.body;
    if (!slug || !studentName || !prizeName) {
      return res.status(400).json({ error: 'Parâmetros de pedido inválidos' });
    }

    const cleanSlug = slugify(slug);
    const orders = await store.getOrders(cleanSlug);

    const newOrder = {
      id: `ord-${crypto.randomBytes(6).toString('hex')}`,
      studentName,
      prizeName,
      skillName: skillName || null,
      timestamp: new Date().toISOString()
    };

    orders.push(newOrder);
    await store.saveOrders(cleanSlug, orders);
    res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ error: 'Erro ao registrar escolha do aluno' });
  }
});

app.get('/api/orders/:customer', async (req, res) => {
  try {
    const slug = slugify(req.params.customer);
    res.json(await store.getOrders(slug));
  } catch (err) {
    console.error('Error retrieving orders:', err);
    res.status(500).json({ error: 'Erro ao recuperar escolhas dos alunos' });
  }
});

app.delete('/api/orders/:customer', async (req, res) => {
  try {
    const slug = slugify(req.params.customer);
    await store.deleteOrders(slug);
    res.json({ success: true });
  } catch (err) {
    console.error('Error clearing orders:', err);
    res.status(500).json({ error: 'Erro ao limpar escolhas dos alunos' });
  }
});

module.exports = app;
