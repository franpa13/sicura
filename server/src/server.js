'use strict';

const app = require('./app');
const config = require('./config/env');
const { sequelize, testConnection } = require('./config/database');

async function start() {
  try {
    await testConnection();
    console.log(`[db] Conectado a MySQL en ${config.db.host}:${config.db.port}/${config.db.name}`);

    // Crea las tablas que falten a partir de los modelos, para que cada dev
    // levante su base desde cero sin pasos manuales.
    //
    // SOLO desarrollo: sync no deja historial de cambios de esquema. Antes de
    // salir a produccion hay que reemplazarlo por migraciones versionadas
    // (sequelize-cli), mientras la base siga vacia y migrar sea barato.
    if (!config.isProduction) {
      await sequelize.sync();
      console.log('[db] Tablas sincronizadas desde los modelos');
    }
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
