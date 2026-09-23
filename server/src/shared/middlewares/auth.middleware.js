'use strict';

const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

/**
 * Esqueleto de autenticacion por JWT. Cuando implementemos la feature auth,
 * aca se verifica el token con config.auth.jwtSecret y se completa req.user.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new UnauthorizedError('Falta el token de autenticacion'));
  }

  // Pendiente: jwt.verify(token, config.auth.jwtSecret) y asignar req.user.
  return next(new UnauthorizedError('Verificacion de token pendiente de implementar'));
}

/** Restringe el acceso segun el rol del usuario autenticado. */
function requireRole(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (roles.length > 0 && !roles.includes(req.user.rol)) {
      return next(new ForbiddenError('No tenés permisos para esta accion'));
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
