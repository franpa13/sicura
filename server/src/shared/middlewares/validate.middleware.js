'use strict';

const { BadRequestError } = require('../utils/errors');

/**
 * Validacion minima de body: verifica que esten los campos requeridos.
 * Se puede reemplazar por zod/joi cuando cada feature defina su esquema.
 */
function requireFields(...campos) {
  return function validator(req, res, next) {
    const faltantes = campos.filter((campo) => {
      const valor = req.body?.[campo];
      return valor === undefined || valor === null || valor === '';
    });

    if (faltantes.length > 0) {
      return next(new BadRequestError('Faltan campos obligatorios', { campos: faltantes }));
    }

    return next();
  };
}

module.exports = { requireFields };
