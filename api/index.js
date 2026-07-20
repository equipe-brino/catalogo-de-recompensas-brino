const serverless = require('serverless-http');
const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

const TMP_DIR = process.env.TMPDIR || process.env.TEMP || process.env.TMP || os.tmpdir();
const ROOT_DATA_DIR = path.join(__dirname, '..', 'data');
const ROOT_UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');
const DATA_DIR = (() => {
  try {
    fs.mkdirSync(ROOT_DATA_DIR, { recursive: true });
    return ROOT_DATA_DIR;
  } catch (err) {
    console.warn('Persistência de dados local indisponível, usando /tmp:', err.message);
    return path.join(TMP_DIR, 'brino-data');
  }
})();
const UPLOAD_DIR = (() => {
  try {
    fs.mkdirSync(ROOT_UPLOAD_DIR, { recursive: true });
    return ROOT_UPLOAD_DIR;
  } catch (err) {
    console.warn('Upload local indisponível, usando /tmp:', err.message);
    return path.join(TMP_DIR, 'brino-uploads');
  }
})();
const CATALOGS_FILE = path.join(DATA_DIR, 'catalogos.json');
const ORDERS_FILE = path.join(DATA_DIR, 'pedidos.json');

for (const dir of [DATA_DIR, UPLOAD_DIR]) {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    console.error('Unable to create runtime directory:', dir, err);
  }
}

try {
  if (!fs.existsSync(CATALOGS_FILE)) fs.writeFileSync(CATALOGS_FILE, JSON.stringify({}, null, 2));
  if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, JSON.stringify({}, null, 2));
} catch (err) {
  console.error('Unable to initialize runtime data files:', err);
}

app.use('/uploads', express.static(UPLOAD_DIR));

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function saveBase64File(dataUrl, prefix) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return dataUrl;

  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return dataUrl;

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

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
    console.error('Error saving base64 file:', err);
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
  const templatePath = path.join(__dirname, '..', 'views', 'catalogo.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error('Template de catálogo ausente no servidor.');
  }

  let html = fs.readFileSync(templatePath, 'utf8');
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'Base.html'));
});

app.get('/api/catalogo/:customer', (req, res) => {
  try {
    const slug = slugify(req.params.customer);
    const catalogs = JSON.parse(fs.readFileSync(CATALOGS_FILE, 'utf8'));
    if (!catalogs[slug]) return res.status(404).json({ error: 'Catálogo não encontrado' });
    res.json(catalogs[slug]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ler catálogo' });
  }
});

app.post('/api/catalogo', (req, res) => {
  try {
    const config = req.body;

    if (!config.teacher || !config.klass || !config.school) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes (professor, turma, escola)' });
    }

    let requestedSlug = slugify(config.slug || `${config.teacher}-${config.klass}-${config.school}`);
    if (!requestedSlug) requestedSlug = 'catalogo';

    if (Array.isArray(config.items)) {
      config.items = config.items.map((item, index) => {
        if (item.img && item.img.startsWith('data:')) {
          item.img = saveBase64File(item.img, `img-prize-${index}`);
        }
        if (item.file && item.file.data && item.file.data.startsWith('data:')) {
          const fileUrl = saveBase64File(item.file.data, `file-prize-${index}`);
          item.file.data = fileUrl;
        }
        return item;
      });
    }

    const catalogs = JSON.parse(fs.readFileSync(CATALOGS_FILE, 'utf8'));
    let finalSlug = requestedSlug;
    let attempts = 0;
    while (catalogs[finalSlug] && catalogs[finalSlug].teacher !== config.teacher && attempts < 100) {
      attempts++;
      finalSlug = `${requestedSlug}-${attempts}`;
    }

    config.slug = finalSlug;
    config.updatedAt = new Date().toISOString();
    catalogs[finalSlug] = config;

    fs.writeFileSync(CATALOGS_FILE, JSON.stringify(catalogs, null, 2));

    res.json({ success: true, slug: finalSlug, url: `/catalogo/${finalSlug}/` });
  } catch (err) {
    console.error('Error creating catalog:', err);
    res.status(500).json({ error: 'Erro ao salvar catálogo' });
  }
});

app.get(['/catalogo/:customer', '/catalogo/:customer/'], (req, res) => {
  try {
    const slug = slugify(req.params.customer);
    const catalogs = JSON.parse(fs.readFileSync(CATALOGS_FILE, 'utf8'));
    const config = catalogs[slug];

    if (!config) {
      return res.status(404).send('<h1>Catálogo não encontrado</h1><p>Verifique o link ou crie um novo catálogo.</p>');
    }

    const rendered = renderCatalogPage(config);
    res.send(rendered);
  } catch (err) {
    console.error('Error rendering catalog:', err);
    res.status(500).send('Erro interno do servidor ao renderizar o catálogo.');
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { slug, studentName, prizeName, skillName } = req.body;
    if (!slug || !studentName || !prizeName) {
      return res.status(400).json({ error: 'Parâmetros de pedido inválidos' });
    }

    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    if (!orders[slug]) orders[slug] = [];

    const newOrder = {
      id: `ord-${crypto.randomBytes(6).toString('hex')}`,
      studentName,
      prizeName,
      skillName: skillName || null,
      timestamp: new Date().toISOString()
    };

    orders[slug].push(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ error: 'Erro ao registrar escolha do aluno' });
  }
});

app.get('/api/orders/:customer', (req, res) => {
  try {
    const slug = slugify(req.params.customer);
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    res.json(orders[slug] || []);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao recuperar escolhas dos alunos' });
  }
});

app.delete('/api/orders/:customer', (req, res) => {
  try {
    const slug = slugify(req.params.customer);
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    if (orders[slug]) {
      delete orders[slug];
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao limpar escolhas dos alunos' });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
