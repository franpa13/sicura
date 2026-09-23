'use strict';

const config = require('../../config/env');

/** Ruta no encontrada: se monta despues de todas las rutas. */
function notFoundHandler(req, res) {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

/** Manejador central de errores. Debe ir ultimo en app.js. */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  if (status >= 500) {
    console.error('[error]', err);
  }

  res.status(status).json({
    message: err.message || 'Error interno del servidor',
    ...(err.details ? { details: err.details } : {}),
    ...(config.isProduction ? {} : { stack: err.stack }),
  });
}

module.exports = { notFoundHandler, errorHandler };
