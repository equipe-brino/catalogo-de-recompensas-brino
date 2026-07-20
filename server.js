const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse large JSON payloads (since users can add custom photos/files as Base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Ensure required directories exist
const DIRS = [
  path.join(__dirname, 'data'),
  path.join(__dirname, 'public', 'uploads'),
  path.join(__dirname, 'doc')
];
DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Paths to database files
const CATALOGS_FILE = path.join(__dirname, 'data', 'catalogos.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'pedidos.json');

// Initialize database files if they do not exist
if (!fs.existsSync(CATALOGS_FILE)) {
  fs.writeFileSync(CATALOGS_FILE, JSON.stringify({}, null, 2));
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify({}, null, 2));
}

/**
 * Helper to generate a URL-safe slug from text
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]+/g, '-')     // replace non-alphanumeric with dashes
    .replace(/(^-|-$)+/g, '');        // trim dashes from ends
}

/**
 * Helper to save a Base64 data URL string to a file in uploads
 * Returns the public URL path on success, or the original data URL on failure/if not Base64
 */
function saveBase64File(dataUrl, prefix) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return dataUrl;
  }

  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return dataUrl;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine file extension
    let ext = 'bin';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('svg')) ext = 'svg';
    else if (mimeType.includes('pdf')) ext = 'pdf';
    else if (mimeType.includes('octet-stream')) ext = 'stl';

    // Generate unique file name
    const filename = `${prefix}-${crypto.randomBytes(8).toString('hex')}.${ext}`;
    const filePath = path.join(__dirname, 'public', 'uploads', filename);

    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error saving base64 file:', err);
    return dataUrl;
  }
}

/**
 * Escapes special HTML characters
 */
function escapeHtml(s) {
  return (s || '').replace(/[&<>"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[c]));
}
function renderCatalogPage(config) {
  const templatePath = path.join(__dirname, 'views', 'catalogo.html');
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
/* ========================================================
   ROUTE HANDLERS
   ======================================================== */

// Home page: Configurator
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Base.html'));
});

// GET /api/catalogo/:customer -> Retrieve JSON catalog config
app.get('/api/catalogo/:customer', (req, res) => {
  try {
    const slug = slugify(req.params.customer);
    const catalogs = JSON.parse(fs.readFileSync(CATALOGS_FILE, 'utf8'));
    if (!catalogs[slug]) {
      return res.status(404).json({ error: 'Catálogo não encontrado' });
    }
    res.json(catalogs[slug]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ler catálogo' });
  }
});

// POST /api/catalogo -> Create/update a catalog configuration
app.post('/api/catalogo', (req, res) => {
  try {
    const config = req.body;

    if (!config.teacher || !config.klass || !config.school) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes (professor, turma, escola)' });
    }

    // Determine slug
    let requestedSlug = slugify(config.slug || `${config.teacher}-${config.klass}-${config.school}`);
    if (!requestedSlug) {
      requestedSlug = 'catalogo';
    }

    // Process prizes inside catalog to extract base64 files/images
    if (Array.isArray(config.items)) {
      config.items = config.items.map((item, index) => {
        // Extract base64 image if present
        if (item.img && item.img.startsWith('data:')) {
          item.img = saveBase64File(item.img, `img-prize-${index}`);
        }
        // Extract base64 downloadable file if present
        if (item.file && item.file.data && item.file.data.startsWith('data:')) {
          const fileUrl = saveBase64File(item.file.data, `file-prize-${index}`);
          item.file.data = fileUrl; // Replace base64 data with file path URL
        }
        return item;
      });
    }

    const catalogs = JSON.parse(fs.readFileSync(CATALOGS_FILE, 'utf8'));

    // If updating existing, or creating new
    // Check if the slug belongs to someone else (collision handling)
    let finalSlug = requestedSlug;
    let attempts = 0;
    while (catalogs[finalSlug] && catalogs[finalSlug].teacher !== config.teacher && attempts < 100) {
      attempts++;
      finalSlug = `${requestedSlug}-${attempts}`;
    }

    // Update config fields
    config.slug = finalSlug;
    config.updatedAt = new Date().toISOString();
    catalogs[finalSlug] = config;

    fs.writeFileSync(CATALOGS_FILE, JSON.stringify(catalogs, null, 2));

    res.json({
      success: true,
      slug: finalSlug,
      url: `/catalogo/${finalSlug}/`
    });
  } catch (err) {
    console.error('Error creating catalog:', err);
    res.status(500).json({ error: 'Erro ao salvar catálogo' });
  }
});

// GET /catalogo/:customer[/] -> Serves dynamic catalog page
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

/* ========================================================
   ORDERS API (STUDENT SUBMISSIONS)
   ======================================================== */

// POST /api/orders -> Save a student prize order locally
app.post('/api/orders', (req, res) => {
  try {
    const { slug, studentName, prizeName, skillName } = req.body;

    if (!slug || !studentName || !prizeName) {
      return res.status(400).json({ error: 'Parâmetros de pedido inválidos' });
    }

    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    if (!orders[slug]) {
      orders[slug] = [];
    }

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

// GET /api/orders/:customer -> Retrieve all student orders for a catalog
app.get('/api/orders/:customer', (req, res) => {
  try {
    const slug = slugify(req.params.customer);
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    res.json(orders[slug] || []);
  } catch (err) {
    console.error('Error retrieving orders:', err);
    res.status(500).json({ error: 'Erro ao recuperar escolhas dos alunos' });
  }
});

// DELETE /api/orders/:customer -> Clear student orders for a catalog
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
    console.error('Error clearing orders:', err);
    res.status(500).json({ error: 'Erro ao limpar escolhas dos alunos' });
  }
});

/* ========================================================
   START SERVER
   ======================================================== */
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Catálogo de Recompensas Br.ino está rodando em:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
