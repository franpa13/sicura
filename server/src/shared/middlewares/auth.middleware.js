'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config/env');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

/**
 * Autenticación por JWT leído desde la cookie httpOnly access_token.
 */
function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;

  if (!token) {
    return next(new UnauthorizedError('Falta el token de autenticación', 'TOKEN_MISSING'));
  }

  try {
    const payload = jwt.verify(token, config.auth.jwtSecret);
    req.user = {
      id: payload.id,
      rol: payload.rol,
    };
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token expirado', 'TOKEN_EXPIRED'));
    }
    return next(new UnauthorizedError('Token inválido', 'TOKEN_INVALID'));
  }
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
