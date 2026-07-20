/**
 * Servidor local de desenvolvimento.
 * Usa a mesma aplicação Express da Vercel (api/app.js), garantindo paridade
 * entre ambientes. Persistência via ./api/store (arquivos JSON localmente,
 * Vercel KV se as variáveis de ambiente estiverem definidas).
 */
const app = require('./api/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Catálogo de Recompensas Br.ino está rodando em:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
