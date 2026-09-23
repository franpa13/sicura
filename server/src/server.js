'use strict';

const app = require('./app');
const config = require('./config/env');
const { testConnection } = require('./config/database');

async function start() {
  try {
    await testConnection();
    console.log(`[db] Conectado a MySQL en ${config.db.host}:${config.db.port}/${config.db.name}`);
  } catch (error) {
    const mensaje = `[db] No se pudo conectar a MySQL: ${error.message}`;

    if (config.isProduction) {
      console.error(mensaje);
      process.exit(1);
    }

    // En desarrollo dejamos levantar la API igual para poder trabajar sin base.
    console.warn(`${mensaje} (el servidor arranca igual porque NODE_ENV=${config.env})`);
  }

  app.listen(config.server.port, () => {
    console.log(`[server] API de SICURA escuchando en http://localhost:${config.server.port} (${config.env})`);
    console.log(`[server] Health check: http://localhost:${config.server.port}/health`);
  });
}

start();
