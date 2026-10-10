'use strict';

require('../config/env');
const { sequelize } = require('../shared/models');

/**
 * Sincroniza los modelos de Sequelize con la base de datos MySQL.
 * Crea o modifica las tablas según los modelos definidos en shared/models.js.
 */
async function syncDatabase() {
  const isForce = process.argv.includes('--force');
  const isAlter = process.argv.includes('--alter');

  // Validación: evitar banderas contradictorias
  if (isForce && isAlter) {
    console.error('[db:sync] ERROR: No se pueden usar --force y --alter simultáneamente.');
    process.exit(1);
  }

  // Salvaguarda: prevenir pérdida accidental de datos en producción
  if (process.env.NODE_ENV === 'production' && (isForce || isAlter)) {
    console.error('[db:sync] ERROR: Por seguridad, no se permite usar --force ni --alter en producción.');
    process.exit(1);
  }

  try {
    console.log('[db:sync] Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log(`[db:sync] Sincronizando tablas (force=${isForce}, alter=${isAlter})...`);

    await sequelize.sync({ force: isForce, alter: isAlter });

    console.log('[db:sync] ¡Tablas sincronizadas exitosamente en MySQL!');
  } catch (error) {
    console.error('[db:sync] Error al sincronizar la base de datos:');
    if (error.original?.sqlMessage) {
      console.error(`[db:sync] Detalle SQL: ${error.original.sqlMessage}`);
    } else {
      console.error(error.message || error);
    }
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  syncDatabase().catch(async (err) => {
    console.error('[db:sync] Error fatal:', err);
    await sequelize.close().catch(() => { });
    process.exit(1);
  });
}

module.exports = { syncDatabase };