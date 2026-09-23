'use strict';

class AppError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    if (details) this.details = details;
    Error.captureStackTrace(this, new.target);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Peticion invalida', details = null) {
    super(message, 400, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

module.exports = { AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError };
