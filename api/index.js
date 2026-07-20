/**
 * Ponto de entrada serverless para a Vercel.
 * A lógica da aplicação vive em ./app (compartilhada com o servidor local).
 */
const serverless = require('serverless-http');
const app = require('./app');

module.exports = app;
module.exports.handler = serverless(app);
